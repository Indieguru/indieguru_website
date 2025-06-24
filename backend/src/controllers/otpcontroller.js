// otpController.js
import axios from "axios";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";

// Store OTPs in memory (in production, you would use Redis or another database)
const otpStorage = {};

export const sendOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const options = {
    method: 'POST',
    url: 'https://www.fast2sms.com/dev/bulkV2',
    headers: {
      'authorization': 'xPvftU1m8z0nIlojQ5aXGZFNh6q4JTEMp2yuObAidY7kerHW9Sd2t0fi5IS4yKjcOzNG3Aqp8sEbl9mr',
      'Content-Type': 'application/json'
    },
    data: {
      variables_values: otp,
      route: 'otp',
      numbers: phone
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json({ message: 'OTP sent', data: response.data });
  } catch (error) {
    res.status(500).json({ message: 'OTP failed', error });
  }
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email using the existing mail service
export const sendEmailOtp = async (req, res) => {
  try {
    const { email, role } = req.body;
    
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
      role: role || 'student', // Default to student if no role provided
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

    // Use the existing mail service to send the OTP
    await sendMail({
      to: email,
      subject: 'Your Verification Code for IndieGuru',
      html: htmlContent
    });
    
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Email OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP email', error: error.message });
  }
};

// Verify email OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Check if OTP exists for this email
    if (!otpStorage[email]) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    const storedOtpData = otpStorage[email];
    
    // Check if OTP has expired
    if (new Date() > new Date(storedOtpData.expiry)) {
      delete otpStorage[email];
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if OTP matches
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark as verified
    storedOtpData.verified = true;
    
    // In a real application, you would:
    // 1. Create or update the user in your database
    // 2. Generate and return JWT tokens
    // 3. Set up session data
    
    // For now, we'll just return success
    res.status(200).json({ 
      message: 'OTP verified successfully',
      user: {
        email,
        role: storedOtpData.role
      }
    });
    
  } catch (error) {
    console.error('Email OTP verification error:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};
