import nodemailer from 'nodemailer';
import twilio from 'twilio';

const otpStore = new Map(); // In-memory store for OTPs

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtp = async (recipient) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Check if recipient is an email or phone number
  const isEmail = recipient.includes('@');
  
  if (isEmail) {
    // Store OTP with email as key
    otpStore.set(recipient, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Sent OTP ${otp} to email ${recipient}`);
  } else {
    // Phone number verification using Twilio
    await twilioClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({ to: `+91${recipient}`, channel: 'sms'});
    console.log(`Sent OTP to phone ${recipient}`);
  }

  return otp;
};

export const verifyOtp = async (recipient, otp) => {
  const isEmail = recipient.includes('@');
  
  if (isEmail) {
    const storedOtp = otpStore.get(recipient);
    if (storedOtp === otp) {
      otpStore.delete(recipient);
      return true;
    }
    return false;
  } else {
    // Phone verification using Twilio
    const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks
      .create({ to: `+91${recipient}`, code: otp });
    return verificationCheck.status === 'approved';
  }
};
