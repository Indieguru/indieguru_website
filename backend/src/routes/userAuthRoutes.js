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
import { sendEmailOtp, verifyEmailOtp } from '../controllers/otpcontroller.js';

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

// Email OTP routes - updating paths since we're now mounted at /user/auth
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { email, otp, role } = req.body;
    
    // First verify the OTP
    const otpResponse = await new Promise((resolve, reject) => {
      verifyEmailOtp(req, {
        status: (code) => ({
          json: (data) => {
            if (code === 200) {
              resolve(data);
            } else {
              reject(data);
            }
          }
        })
      });
    });
    
    // If OTP verification succeeds, find or create the user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = new User({
        email,
        role: role || 'student',
        emailVerified: true,
        authType: 'email', // Set the authType to 'email' for email OTP authentication
        firstName: email.split('@')[0], // Use part of email as temporary name
        lastName: '', // Empty string for lastName
      });
      await user.save();
    } else if (!user.authType) {
      // If user exists but authType is not set (which should not happen, but just in case)
      user.authType = 'email';
      await user.save();
    }
    
    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();
    
    // Set cookies
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('userId', user._id, { httpOnly: true, secure: true, sameSite: "none" });
    
    // Send response
    res.status(200).json({ 
      message: 'Authentication successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
});

router.get('/google', passport.authenticate('google-user', {
  scope: [
    'profile',
    'email',
  ],
}));

router.get('/google/callback', passport.authenticate('google-user', { failureRedirect: '/login', session: false }), async (req, res) => {
  const userId = req.user.user._id; 
  const token = req.user.token;
  const role = req.user.role || 'student';

  try {
    const user = await User.findById(userId);
    const refreshToken = generateRefreshToken(user);
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

router.post('/signout', authMiddleware, async (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: "none" });
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: "none" });
  res.clearCookie('userId', { httpOnly: true, secure: true, sameSite: "none" });
  res.status(200).json({ message: 'Logged out successfully' });
})


router.get('/check-auth', authMiddleware,(req, res) => {
  console.log("User ID from authMiddleware:", req.user.id);
  res.status(200).json({ message: 'Authenticated'});
});


export default router;