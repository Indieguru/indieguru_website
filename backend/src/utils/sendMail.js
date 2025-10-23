import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      // Try sending the email using Resend API
      const response = await resend.emails.send(mailOptions);
      // ✅ Log Resend's response to verify delivery
      console.log("Resend API response:", response.error);
      if (response.error) {
     console.error("⚠️ Resend API returned an error:", response.error);
      throw new Error(response.error.message || "Resend API returned an unknown error");
    }
      console.log(`✅ Email sent successfully to ${to} on attempt ${attempts + 1}`);
      return; // Success — exit the function
    } catch (error) {
      attempts++;
      console.error(`❌ Email attempt ${attempts} failed:`, error.message);

      if (attempts === maxAttempts) {
        console.error('All email sending attempts failed. Email functionality is degraded.');
        throw new Error(`Failed to send email to ${to} after ${maxAttempts} attempts`);
      }

      // Exponential backoff before retry
      const delay = Math.min(Math.pow(2, attempts) * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
