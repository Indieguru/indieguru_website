import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import passport from 'passport';
import Expert from '../models/Expert.js';
import '../services/passport.js'; // Import Passport configuration
import { sendOtp, verifyOtp } from '../services/otpService.js'; // Import OTP service

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';

// Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (id) => jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });



// Google OAuth routes for expert
router.get('/google', passport.authenticate('google-expert', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google-expert', { session: false }), (req, res) => {
  if (req.user) {
    res.status(200).json({ message: 'Expert signed in successfully', token: req.user.token });
  } else {
    res.status(400).json({ message: 'Google authentication failed' });
  }
});

export default router;