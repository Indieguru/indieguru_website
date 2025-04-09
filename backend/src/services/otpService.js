import nodemailer from 'nodemailer';

const otpStore = new Map(); // In-memory store for OTPs

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtp = async (email, phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Send OTP ${otp} to email ${email}`);

  return otp;
};

export const verifyOtp = async (email, otp) => {
  const storedOtp = otpStore.get(email);
  if (storedOtp === otp) {
    otpStore.delete(email);
    return true;
  }
  return false;
};
