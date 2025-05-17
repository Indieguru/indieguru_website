import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema({
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['bank_transfer', 'upi', 'paypal']
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountName: String
  },
  upiId: String,
  paypalEmail: String,
  transactionId: String,
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  remarks: String
}, {
  timestamps: true
});

export default mongoose.model("Withdrawal", WithdrawalSchema);