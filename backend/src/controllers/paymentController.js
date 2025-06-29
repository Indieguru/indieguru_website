import crypto from "crypto";
import razorpay from "../utils/razorpayInstance.js";
import Payment from "../models/Order.js";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Expert from "../models/Expert.js";
// import { bookSession } from "./sessionController.js";

export const createOrder = async (req, res) => {
  try {
    const { amount,bookingType } = req.body;
    if(bookingType === "session") {
      //  console.log(req.user)
          const { sessionId } = req.params;
          const sanitizedSessionId = sessionId.trim(); 
          const { sessionTitle } = req.body;
          // console.log("sessionId", sessionId);
          const user = await User.findById(req.user.id);
          const session = await Session.findById(sanitizedSessionId).populate('expert');
          const studentName = req.body.studentName || user.firstName || user.lastName || 'Anonymous Student';
          const expert = await Expert.findById(session.expert);
      
          if (!session) {
            return res.status(404).json({ success:false,message: 'Session not found' });
          }
          if (session.bookedStatus) {
            return res.status(400).json({ sucess:false,message: 'Session already booked' });
          }
      
    }
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);

    await Payment.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          isVerified: true,
        },
        { new: true }
      );
      return res.status(200).json({ success: true, message: "Payment verified", payment });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
