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


router.get('/google/callback', passport.authenticate('google-expert', { failureRedirect: '/login', session: false }), async (req, res) => {
  const userId = req.user.user._id;
  const token = req.user.token;
  try {
    const user = await Expert.findById(userId);
    if (user) {
      user.googleRefreshToken = req.user.googleRefreshToken;  // Save the Google refresh token
      await user.save();
    }

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('refreshToken', req.user.localRefreshToken, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('userId', userId, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('googleRefreshToken', req.user.googleRefreshToken, { httpOnly: true, secure: true, sameSite: "none" });
    res.cookie('accessToken', req.user.accessToken, { httpOnly: true, secure: true, sameSite: "none" });
    
    if (process.env.TYPE === 'development')
      return res.redirect(`${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/expert`);
    else
      return res.redirect(`${process.env.FRONTEND_URL}/expert`);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

export default router;

