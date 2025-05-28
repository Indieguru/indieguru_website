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
  purchasedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  purchasedCohorts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cohort'
  }],
  assessment: {
    role: {
      type: String,
      enum: [
        'High School Student (Class 11-12)',
        'Secondary School Student (Class 9-10)',
        'Undergraduate Student',
        'Postgraduate Student',
        'Working Professional'
      ],
      default: 'High School Student (Class 11-12)'
    },
    stream: {
      type: String,
      enum: ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts/Humanities'],
      default: 'Science (PCM)'
    },
    degree: String,
    learningStyle: String,
    confusion: {
      type: Number,
      min: 1,
      max: 10
    },
    careerJourney: String,
    lastUpdated: Date,
    linkedinUrl: String,
    fullName: String,
    phoneNumber: String,
    email: String,
    city: String,
    guidanceFor: String,
    submittedAt: Date
  }
}, {
  timestamps: true
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