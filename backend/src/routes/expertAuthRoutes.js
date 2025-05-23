import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import Expert from '../models/Expert.js';
import '../services/passport.js'; // Import Passport configuration
import expertAuthMiddleware from '../middlewares/expertAuthMiddleware.js'; // Import expert auth middleware

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';


const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_ESECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id },process.env.JWT_EREFRESH_SECRET, { expiresIn: '7d' });
};


router.use(cookieParser());

router.get('/google', passport.authenticate('google-expert', {
  scope: [
    'profile',
    'email',
  ],
}));

router.get('/google/callback', passport.authenticate('google-expert', { failureRedirect: '/login', session: false }), async (req, res) => {
  const userId = req.user.user._id; 
  const token = req.user.token;
  const role = req.user.role || 'expert';

  try {
    const user = await Expert.findById(userId);
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


router.post('/logout', expertAuthMiddleware, async (req, res) => {
  try {
    // Clear all cookies
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie('userId', { httpOnly: true, secure: true, sameSite: "none" });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout', error: error.message });
  }
});

router.get('/check-auth', expertAuthMiddleware,(req, res) => {
  // console.log("User ID from authMiddleware:", req.user.id);
  console.log("User ID from authMiddleware:", req.user.id);
  res.status(200).json({ message: 'Authenticated'});
});

export default router;

