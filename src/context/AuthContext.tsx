import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  balance: number;
  poshCredits: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateBalance: (newBalance: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  updateBalance: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid, 'profile', 'info');
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const initialProfile: UserProfile = {
              id: currentUser.uid,
              name: currentUser.displayName || 'Marketplace Member',
              email: currentUser.email || '',
              handle: `@${(currentUser.email?.split('@')[0] || 'posh_user').toLowerCase()}`,
              avatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              balance: 420.50,
              poshCredits: 15.00,
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}/profile/info`);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign-In Error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!user || !userProfile) return;
    const userDocRef = doc(db, 'users', user.uid, 'profile', 'info');
    try {
      await setDoc(userDocRef, { ...userProfile, balance: newBalance }, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, balance: newBalance } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/profile/info`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signOut: handleSignOut,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
