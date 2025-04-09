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

// Zod schemas for validation
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  authType: z.enum(['gmail', 'email']),
  gid: z.string().optional(),
  otp: z.string().optional(),
});

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  authType: z.enum(['gmail', 'email']),
  gid: z.string().optional(),
  otp: z.string().optional(),
});

// Expert Signup
router.post('/signup', async (req, res) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
  }

  const { name, email, password, authType, gid, otp } = req.body;

  try {
    const existingExpert = await Expert.findOne({ email });
    if (existingExpert) {
      return res.status(400).json({ message: 'Expert already exists' });
    }

    if (authType === 'email') {
      const isOtpValid = await verifyOtp(email, otp);
      if (!isOtpValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
    }

    const hashedPassword = authType === 'email' ? await bcrypt.hash(password, 10) : undefined;

    const expert = new Expert({
      name,
      email,
      password: hashedPassword,
      authType,
      gid,
      emailVerified: authType === 'gmail',
    });

    await expert.save();
    const token = generateToken(expert._id);
    res.status(201).json({ message: 'Expert registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Expert Sign-in
router.post('/signin', async (req, res) => {
  const validation = signinSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
  }

  const { email, password, authType, gid, otp } = req.body;

  try {
    const expert = await Expert.findOne({ email });
    if (!expert) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (authType === 'email') {
      const isMatch = await bcrypt.compare(password, expert.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      if (!expert.emailVerified) {
        const isOtpValid = await verifyOtp(email, otp);
        if (!isOtpValid) {
          return res.status(400).json({ message: 'Invalid OTP' });
        }
      }
    } else if (authType === 'gmail' && expert.gid !== gid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(expert._id);
    const refreshToken = generateRefreshToken(expert._id);
    expert.refreshToken = refreshToken;
    await expert.save();
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Expert signed in successfully', token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const expert = await Expert.findById(decoded.id);
    if (!expert || expert.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    const newToken = generateToken(expert._id);
    const newRefreshToken = generateRefreshToken(expert._id);
    expert.refreshToken = newRefreshToken;
    await expert.save();

    res.cookie('token', newToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token.' });
  }
});

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