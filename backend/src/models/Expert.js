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
  expertise: [{
    type: String,
    enum: [
      'stream_selection',
      'career_counseling',
      'competitive_exams',
      'study_abroad',
      'resume_interview',
      'entrepreneurship',
      'higher_education',
      'career_transition',
      'industry_specific'
    ]
  }],
  targetAudience: [{
    type: String,
    enum: [
      'High School Student (Class 11-12)',
      'Secondary School Student (Class 9-10)',
      'Undergraduate Student',
      'Postgraduate Student',
      'Working Professional'
    ]
  }],
  industries: [{
    type: String,
    enum: [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Engineering',
      'Marketing',
      'Design',
      'Business Management',
      'Data Science',
      'Research & Development',
      'Manufacturing',
      'Consulting',
      'Law',
      'Media & Entertainment',
      'Architecture',
      'Life Sciences'
    ]
  }],
}, {
  timestamps: true
});

ExpertSchema.pre('save', function (next) {
  if (this.authType === 'email' && !this.password) {
    return next(new Error('Password is required for email signup'));
  }
  next();
});

export default mongoose.model("Expert", ExpertSchema);