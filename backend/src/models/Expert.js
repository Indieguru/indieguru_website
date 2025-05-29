import mongoose from "mongoose";

const ExpertSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: true
  },
  lastName: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    // required: true,
    unique: true
  },
  phoneNo: {
    type: String
  },
  title: {
    type: String
  },
  gid: String,
  authType: {
    type: String,
    enum: ['email', 'gmail'],
    default: 'email'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  rejectionReason: {
    type: String
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
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    startYear: {
      type: Number,
      required: true
    },
    endYear: {
      type: Number,
      required: true
    },
    description: String,
    documents: [{
      url: String,
      filename: String,
      mimetype: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    status: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending'
    }
  }],
  certifications: [{
    name: {
      type: String,
      // required: true
    },
    issuer: {
      type: String,
      // required: true
    },
    certificateFile: {
      url: String,
      filename: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    status: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending'
    },
    expiryDate: Date,
    credentialId: String
  }],
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    description: String
  }],
  sessionPricing: {
    expertFee: {
      type: Number,
      default: 0
    },
    platformFee: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  outstandingAmount: {
    total: {
      type: Number,
      default: 0
    },
    sessions: {
      type: Number,
      default: 0
    },
    courses: {
      type: Number,
      default: 0
    },
    cohorts: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to validate required fields for email signup
ExpertSchema.pre('save', function(next) {
  if (this.authType === 'email' && !this.password) {
    return next(new Error('Password is required for email signup'));
  }
  
  // Calculate total session price
  if (this.sessionPricing) {
    this.sessionPricing.total = (this.sessionPricing.expertFee || 0) + (this.sessionPricing.platformFee || 0);
  }
  
  next();
});

// Virtual for full name
ExpertSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Include virtuals when converting to JSON
ExpertSchema.set('toJSON', { virtuals: true });

export default mongoose.model("Expert", ExpertSchema);