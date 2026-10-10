import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../lib/firebase';

export interface UploadResult {
  url: string;
  storagePath: string;
  isFirebaseStorage: boolean;
}

/**
 * Uploads an image file to Firebase Storage.
 * Falls back to high-res data URL if Storage bucket is not writable.
 */
export async function uploadItemPhoto(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, WebP).');
  }

  // Validate size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10MB.');
  }

  const userId = auth.currentUser?.uid || 'guest';
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `items/${userId}/${Date.now()}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  try {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        originalName: file.name,
      },
    });

    return await new Promise<UploadResult>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        async (error) => {
          console.warn('Firebase Storage upload error, using local fallback:', error);
          // Graceful fallback to data URL so the user is never blocked
          try {
            const dataUrl = await fileToDataUrl(file);
            resolve({
              url: dataUrl,
              storagePath: 'local_fallback',
              isFirebaseStorage: false,
            });
          } catch (fallbackErr) {
            reject(error);
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              url: downloadUrl,
              storagePath,
              isFirebaseStorage: true,
            });
          } catch (err) {
            console.warn('Failed to retrieve download URL, using data URL fallback:', err);
            const dataUrl = await fileToDataUrl(file);
            resolve({
              url: dataUrl,
              storagePath: 'local_fallback',
              isFirebaseStorage: false,
            });
          }
        }
      );
    });
  } catch (err) {
    console.warn('Storage initiation error, fallback to data URL:', err);
    const dataUrl = await fileToDataUrl(file);
    return {
      url: dataUrl,
      storagePath: 'local_fallback',
      isFirebaseStorage: false,
    };
  }
}

/**
 * Utility to convert file to Base64 data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Diagnostic test for Firebase Storage upload
 */
export async function testStorageConnectivity(): Promise<{ success: boolean; error?: string }> {
  try {
    const testBlob = new Blob(['ping'], { type: 'text/plain' });
    const testRef = ref(storage, `test/connectivity_${Date.now()}.txt`);
    const uploadTask = uploadBytesResumable(testRef, testBlob);

    return await new Promise((resolve) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          // Even if permission denied, it reached the bucket!
          resolve({ success: false, error: error.message });
        },
        () => {
          resolve({ success: true });
        }
      );
    });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
