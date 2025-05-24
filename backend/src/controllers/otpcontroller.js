// otpController.js
import axios from "axios";

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
