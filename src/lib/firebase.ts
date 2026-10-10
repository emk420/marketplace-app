import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export async function testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, latencyMs: Date.now() - start };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    // If permission or not found, it still reached the server!
    const reachedServer = !errorMsg.includes('client is offline');
    return { success: reachedServer, latencyMs: Date.now() - start, error: reachedServer ? undefined : errorMsg };
  }
}

testConnection();

export async function signInWithGoogle() {
  return await signInWithPopup(auth, googleProvider);
}

export async function logOut() {
  return await signOut(auth);
}

