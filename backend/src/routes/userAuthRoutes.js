import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import passport from 'passport';
import User from '../models/User.js';
import '../services/passport.js';
import twilio from 'twilio';
import authMiddleware from '../middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import admin from '../config/firebaseAdmin.js';
import { sendMail } from '../utils/sendMail.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';

// Store OTPs in memory (in production, you would use Redis or another database)
const otpStorage = {};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
router.post('/send-email-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a new OTP
    const otp = generateOTP();
    
    // Store OTP with expiry time (30 minutes)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);
    
    otpStorage[email] = {
      otp,
      expiry: expiryTime,
      verified: false
    };

    // Create email HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #0a2540;">Welcome to IndieGuru!</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 10px; background-color: #f7f7f7; border-radius: 5px;">${otp}</h1>
        <p>This code will expire in 30 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">© IndieGuru. All rights reserved.</p>
      </div>
    `;

    // Send email
    await sendMail({
      to: email,
      subject: 'Your Verification Code for IndieGuru',
      html: htmlContent
    });
    
    // In development mode, return OTP for easier testing
    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json({ 
        message: 'OTP sent successfully', 
        otp: otp // Only included in development mode
      });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

router.post('/verify-email-otp', async (req, res) => {
  try {
    const { email, otp, assessmentData } = req.body;
    
    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with assessment data
      user = new User({
        email,
        emailOtp: otp,
        authType: 'email',
        firstName: assessmentData?.fullName?.split(' ')[0] || '',
        lastName: assessmentData?.fullName?.split(' ').slice(1).join(' ') || '',
        phone: assessmentData?.phoneNumber,
      });
    }

    // Verify OTP
    const otpData = otpStorage[email];
    if (!otpData || otpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (new Date() > otpData.expiry) {
      delete otpStorage[email];
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark email as verified
    user.emailVerified = true;

    // Clean assessment data before saving
    if (assessmentData) {
      // Convert empty strings to null for enum fields
      const cleanedAssessment = {
        ...assessmentData,
        role: assessmentData.role || null,
        stream: assessmentData.stream || null,
        careerJourney: assessmentData.careerJourney || null,
        submittedAt: new Date()
      };
      user.assessment = cleanedAssessment;
    }

    await user.save();

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();
    
    // Clear OTP
    delete otpStorage[email];
    
    // Set cookies
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('userId', user._id, { httpOnly: true, secure: true, sameSite: "none" });
    
    // Send response
    res.status(200).json({ 
      message: 'OTP verified and user authenticated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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