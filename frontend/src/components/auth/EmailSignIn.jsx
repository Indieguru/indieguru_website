import React, { useState } from 'react';
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from '../../config/firebase';
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const actionCodeSettings = {
  // Update this URL to match your deployment
  url: `${import.meta.env.VITE_FRONTEND_URL}${import.meta.env.VITE_TYPE === 'development' ? `:${import.meta.env.VITE_FRONTEND_PORT}` : ''}/finish-signup`,
  handleCodeInApp: true,
};

export default function EmailSignIn() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSendLink = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSendLink} className="space-y-4">
      <div>
        <Input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-[#d8d8d8] bg-white"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Failed to send verification email. Please try again.
        </p>
      )}

      {status === 'success' && (
        <p className="text-green-500 text-sm">
          Verification link sent! Please check your email.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-blue-800 text-white hover:bg-[#143d65]"
      >
        {status === 'sending' ? 'Sending...' : 'Send Verification Link'}
      </Button>
    </form>
  );
}