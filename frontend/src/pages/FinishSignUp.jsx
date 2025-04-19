import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios.config';

export default function FinishSignUp() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // If email is not found, you might want to prompt the user for it
          email = window.prompt('Please provide your email for confirmation');
        }

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          
          // Get the Firebase ID token
          const idToken = await result.user.getIdToken();
          
          // Send the token to your backend
          await axiosInstance.post("/user/auth/firebase-login", {
            email: result.user.email,
            firebaseToken: idToken,
          });

          // Clear email from storage
          window.localStorage.removeItem('emailForSignIn');
          
          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Error signing in with email link:', error);
          setError('Failed to complete sign in. Please try again.');
        }
      } else {
        setError('Invalid verification link.');
      }
      setLoading(false);
    };

    completeSignIn();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#232636] mb-4">Verifying...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Verification Failed</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}