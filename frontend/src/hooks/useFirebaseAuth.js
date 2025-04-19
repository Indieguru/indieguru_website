import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import axiosInstance from '../config/axios.config';

export const useFirebaseAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          // Get custom token from your backend
          const response = await axiosInstance.get('/user/auth/firebase-token');
          if (response.data.customToken) {
            await signInWithCustomToken(auth, response.data.customToken);
          }
        } catch (error) {
          console.error('Error getting Firebase token:', error);
        }
      }
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser, loading };
};