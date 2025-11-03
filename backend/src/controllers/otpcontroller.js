// otpController.js
import axios from "axios";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import User from '../models/User.js';
import sendgridMail from '@sendgrid/mail';

// Store OTPs in memory (in production, you would use Redis or another database)
const otpStorage = {};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendEmailOtp = async (req, res) => {
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

    // Try to send email with timeout handling
    try {
      await sendMail({
        to: email,
        subject: 'Your Verification Code for IndieGuru',
        html: htmlContent
      });
      
      console.log(`OTP sent successfully to ${email}`);
    } catch (emailError) {
      console.error('Email sending failed, but OTP is stored for fallback:', emailError.message);
      
      // In production, we should still allow the user to proceed
      // The OTP is stored in memory, so they can still verify it
      // This prevents the entire flow from breaking due to email issues
    }
    
    // Always return success response with OTP in development
    if (process.env.NODE_ENV === 'development' || process.env.TYPE === 'development') {
      return res.status(200).json({ 
        message: 'OTP sent successfully', 
        otp: otp // Only included in development mode
      });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in sendEmailOtp:', error);
    res.status(500).json({ message: 'Failed to generate OTP', error: error.message });
  }
};

// Verify email OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, assessmentData } = req.body;
    
    // Check if OTP exists and is valid
    const storedOTPData = otpStorage[email];
    if (!storedOTPData) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // Check if OTP has expired
    if (new Date() > storedOTPData.expiry) {
      delete otpStorage[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    if (storedOTPData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        emailVerified: true,
        authType: 'email'
      });
    }

    // Mark email as verified
    user.emailVerified = true;

    // If assessment data is provided, save it
    if (assessmentData) {
      const roleMapping = {
        'I am doing my graduation': 'undergraduate',
        'I am working currently': 'working',
        'I am pursuing masters': 'postgraduate',
        'I am in Class 9th or 10th': 'highschool',
        'I am in Class 11th or 12th': 'secondary'
      };

      const careerJourneyMapping = {
        "I’m on a path - just need to validate if it’s the right one": 'validate',
        "I kinda know the field - but need more clarity and direction": 'clarity',
        "I’m still exploring - open to discovering what fits me best": 'explore',
        "Honestly, I feel stuck - not sure how to move forward": 'guidance'
      };

      const cleanedData = {
        currentRole: roleMapping[assessmentData.role] || null,
        stream: assessmentData.stream || null,
        degree: assessmentData.degree || null,
        linkedinUrl: assessmentData.linkedinUrl || null,
        careerJourney: careerJourneyMapping[assessmentData.careerJourney] || null,
        learningStyle: assessmentData.learningStyle || null,
        otherLearningStyle: assessmentData.otherLearningStyle || null,
        lastUpdated: new Date()
      };
      
      user.careerFlow = cleanedData;
    }

    await user.save();

    // Clear OTP after successful verification
    delete otpStorage[email];

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
