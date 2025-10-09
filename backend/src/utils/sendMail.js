import nodemailer from 'nodemailer';

// Primary transporter (Gmail)
const primaryTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Production-friendly configuration
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 14,
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  secure: true,
  requireTLS: true,
  tls: {
    rejectUnauthorized: false
  }
});

// Fallback transporter (SMTP)
const fallbackTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

/**
 * Send an email easily
 * @param {Object} options
 * @param {string} options.to - Recipient's email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 */
export const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"IndieGuru" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      // Try primary transporter first
      if (attempts < 2) {
        await primaryTransporter.sendMail(mailOptions);
      } else {
        // Use fallback transporter on final attempt
        await fallbackTransporter.sendMail(mailOptions);
      }
      
      console.log(`Email sent successfully to ${to} on attempt ${attempts + 1}`);
      return; // Success, exit the function
    } catch (error) {
      attempts++;
      console.error(`Email attempt ${attempts} failed:`, error.message);
      
      if (attempts === maxAttempts) {
        // Log the error but don't break the application flow
        console.error('All email sending attempts failed. Email functionality is degraded.');
        throw new Error(`Failed to send email to ${to} after ${maxAttempts} attempts`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(Math.pow(2, attempts) * 1000, 10000); // Max 10 seconds
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
