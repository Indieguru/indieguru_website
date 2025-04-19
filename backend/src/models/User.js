import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    // default: "jfebwbi",
  },
  lastName: {
    type: String,
    required: true,
    // default: "cnklenenllj",
  },
  email: {
    type: String,
    unique: true,
  },
  emailOtp: String,
  emailVerified: { type: Boolean, default: false },
  phone: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
  },
  phoneVerified: { 
    type: Boolean, 
    default: false 
  },
  authType: {
    type: String,
    required: true,
    enum: ['gmail', 'phone'],
  },
  gid: {
    type: String,
  },
  interests: {
    type: [String],
    default: [],
  },
  goals: {
    type: [String],
    default: [],
  },
  gender: {
    type: String,
    // enum: ['male', 'female', 'prefer not to say'],
    default: 'prefer not to say',
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

UserSchema.pre('save', function (next) {
  if (this.authType === 'email' && !this.password) {
    return next(new Error('Password is required for email signup'));
  }
  if (this.authType === 'phone' && !this.phone) {
    return next(new Error('Phone number is required for phone signup'));
  }
  next();
});

export default mongoose.model("User", UserSchema);