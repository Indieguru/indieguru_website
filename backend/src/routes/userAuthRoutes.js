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



// // Send OTP using Twilio
// const sendOtp = async (phone) => {
//   await twilioClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
//     .verifications
//     .create({ to: `+91${phone}`, channel: 'sms'});
//   // return otp;
// };

// const verifyOtp = async (phone, otp) => {
//   const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
//     .verificationChecks
//     .create({ to: `+91${phone}`, code: otp });
//   return verificationCheck.status === 'approved';
// };

// In-memory store for OTPs (replace with a more secure solution like Redis)
router.use(cookieParser());

// User Signup



// // Request OTP
// router.post('/request-otp', async (req, res) => {
//   const {phone} = req.body;
//   console.log(req.body);
//   // if(!idi){
//   //   console.log(idi);
//   // }
//   if (!phone) {
//     // console.log(phone)
//     return res.status(400).json({ message: 'Phone number is required' });
//   }
//   // if ( !/^\d{10}$/.test(phone)) {
//   //   return res.status(400).json({ message: 'Invalid phone number' });
//   // }

//   try {
//     const otp = await sendOtp(phone);
//     // otpStore.set(phone, otp); // Store OTP temporarily
//     // setTimeout(() => otpStore.delete(phone), 300000); // OTP expires in 5 minutes
//     res.status(200).json({ message: 'OTP sent successfully' });
//     console.log('OTP sent successfully');
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ message: 'Failed to send OTP', error });
//   }
// });

// // Phone Signup/Signin
// router.post('/phone-auth', async (req, res) => {
//   const validation = otpSchema.safeParse(req.body);
//   if (!validation.success) {
//     return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
//   }

//   const { phone, otp } = req.body;
//   const isValidOtp = await verifyOtp(phone, otp);
//   if (!isValidOtp) {
//     return res.status(400).json({ message: 'Invalid or expired OTP' });
//   }

//   try {
//     let user = await User.findOne({ phone });
//     if (!user) {
//       user = new User({
//         firstName: `User-${phone}`,
//         lastName: 'gyohyohioii',
//         phone:phone,
//         authType: 'phone',
//         phoneVerified: true,
//       });
//       await user.save();
//     }

//     const token = generateToken(user);
//     const refreshToken = generateRefreshToken(user);
//     user.refreshToken = refreshToken;
//     const userId = user._id;
//     await user.save();
//     res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" });
//     res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
//     res.cookie('userId', userId, { httpOnly: true, secure: true , sameSite: "none"});

//     res.status(200).json({ message: 'Authentication successful'});
//   } catch (error) {
//     console.error('Error during phone authentication:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// Google OAuth Routes for User
router.get('/google', passport.authenticate('google-user', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google-user', { failureRedirect: '/login', session: false }), async (req, res) => {
  const userId = req.user.user._id; 
  const token = req.user.token;

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
    if(process.env.TYPE === 'development')
    return res.redirect(`${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/dashboard`); 
    else
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

  // Ensure return after res.redirect
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error }); // Ensure return after res.json
  }
});
// 🔐 POST /verify-phone
router.post('/firebase-login', async (req, res) => {
  const { email, phone, firebaseToken } = req.body;

  if (!firebaseToken) return res.status(400).json({ message: 'Missing Firebase token' });

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    
    // Handle email authentication
    if (email) {
      if (email !== decodedToken.email) {
        return res.status(400).json({ message: 'Email mismatch' });
      }

      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          firstName: 'User',
          lastName: email.split('@')[0],
          email,
          authType: 'email',
          emailVerified: true,
        });
        await user.save();
      }

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
      
      return res.status(200).json({ message: 'Email verified and user authenticated' });
    }
    
    // Handle phone authentication
    if (phone) {
      const phoneNumber = decodedToken.phone_number;
      if (!phoneNumber) {
        return res.status(400).json({ message: 'Invalid phone token' });
      }

      let user = await User.findOne({ phone });
      if (!user) {
        user = new User({
          firstName: 'User',
          lastName: phone,
          phone,
          authType: 'phone',
          phoneVerified: true,
        });
        await user.save();
      }

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: "none" });

      return res.status(200).json({ message: 'Phone verified and user authenticated' });
    }

    return res.status(400).json({ message: 'Invalid authentication request' });
  } catch (error) {
    console.error('Firebase verification error:', error);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
});

router.get('/firebase-token', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a Firebase custom token
        const customToken = await admin.auth().createCustomToken(user.id.toString());
        res.json({ customToken });
    } catch (error) {
        console.error('Error creating Firebase token:', error);
        res.status(500).json({ message: 'Failed to create Firebase token' });
    }
});

router.get('/check-auth', authMiddleware,(req, res) => {
  res.status(200).json({ message: 'Authenticated'});
});





export default router;