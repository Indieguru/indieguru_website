import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import passport from 'passport';
import User from '../models/User.js';
import '../services/passport.js'; // Import Passport configuration
import twilio from 'twilio';
import authMiddleware from '../middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import admin from '../config/firebaseAdmin.js'; // Import Firebase Admin SDK
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';

// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Generate JWT Token

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


router.use(cookieParser());


router.get('/google', passport.authenticate('google-user', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar' // Add calendar access
  ],
  accessType: 'offline',   // Request refresh token
  prompt: 'consent'        // Force Google to show consent screen
}));

router.get('/google/callback', passport.authenticate('google-user', { failureRedirect: '/login', session: false }), async (req, res) => {
  const userId = req.user.user._id; 
  const token = req.user.token;
  const role = req.user.role || 'student';

  try {
    const refreshToken = generateRefreshToken(userId);
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = refreshToken;
      await user.save();
    }

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('userId', userId, { httpOnly: true, secure: true, sameSite: "none" });
    
    // Redirect based on role
    if(process.env.TYPE === 'development') {
      return res.redirect(`${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}${role === 'expert' ? '/expert' : '/dashboard'}`);
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}${role === 'expert' ? '/expert' : '/dashboard'}`);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});
// 🔐 POST /verify-phone



router.get('/check-auth', authMiddleware,(req, res) => {
  console.log("User ID from authMiddleware:", req.user.id);
  res.status(200).json({ message: 'Authenticated'});
});


export default router;