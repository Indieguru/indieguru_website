import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios.config';
import LoadingScreen from '../components/common/LoadingScreen';

export default function FinishSignUp() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = sessionStorage.getItem('emailForSignIn'); // Using sessionStorage instead
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          const idToken = await result.user.getIdToken();
          
          await axiosInstance.post("/user/auth/firebase-login", {
            email: result.user.email,
            firebaseToken: idToken,
          });

          sessionStorage.removeItem('emailForSignIn');
          navigate('/dashboard');
        } catch (error) {
          console.error('Error signing in:', error);
          setError('Failed to verify email. Please try again.');
        }
      } else {
        setError('Invalid verification link.');
      }
      setLoading(false);
    };

    completeSignIn();
  }, [navigate]);

  if (loading) {
    return <LoadingScreen />;
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