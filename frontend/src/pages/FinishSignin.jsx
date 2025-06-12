import React, { useEffect } from 'react';
import { auth } from '../config/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import axiosInstance from '../config/axios.config';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

export default function FinishSignIn() {
  const navigate = useNavigate();
  const { refreshUser } = useUserStore();

  useEffect(() => {
    const email = sessionStorage.getItem('emailForSignIn');

    if (isSignInWithEmailLink(auth, window.location.href) && email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result) => {
          try {
            // Update email in backend
            await axiosInstance.put('/user/update', { email });
            // Force refresh user data after email update
            await refreshUser();
            sessionStorage.removeItem('emailForSignIn');
            alert('Email successfully updated!');
            navigate('/profile');
          } catch (error) {
            console.error('Error updating email in backend:', error);
            alert('Failed to update email in backend. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error signing in:', error);
          alert('Failed to verify email. Please try again.');
        });
    }
  }, [navigate, refreshUser]);

  return <p>Verifying and updating email...</p>;
}