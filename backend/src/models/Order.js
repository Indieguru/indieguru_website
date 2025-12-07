import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    isVerified: { type: Boolean, default: false },
    itemType: {
      type: String,
      required: true,
      enum: ["Course", "Cohort", "Session"],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "itemType",
      required: true,
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;


// MADE BY ME FOR RAZORPAY USE PLEASE CHECK THIS