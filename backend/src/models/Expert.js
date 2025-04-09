import mongoose from "mongoose";

const ExpertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  emailOtp: String,
  emailVerified: { type: Boolean, default: false },
  authType: {
    type: String,
    required: true,
    enum: ['gmail', 'email'],
  },
  
  gid: {
    type: String,
  },
});

ExpertSchema.pre('save', function (next) {
  if (this.authType === 'email' && !this.password) {
    return next(new Error('Password is required for email signup'));
  }
  next();
});

export default mongoose.model("Expert", ExpertSchema);