import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;


// MADE BY ME FOR RAZORPAY USE PLEASE CHECK THIS