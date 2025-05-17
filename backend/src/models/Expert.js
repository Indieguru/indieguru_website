import { refreshToken } from "firebase-admin/app";
import mongoose from "mongoose";

const ExpertSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  phoneNo: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailOtp: String,
  emailVerified: { type: Boolean, default: false },
  authType: {
    type: String,
    enum: ['gmail'],
  },
  gid: {
    type: String,
  },
  googleRefreshToken: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['rejected', 'pending', 'approved','not requested'],
    default: 'not requested',
  },
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
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    issuedDate: {
      type: Date,
      required: true
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
  earnings: {
    sessionEarnings: {
      total: {
        type: Number,
        default: 0
      },
      pending: {
        type: Number,
        default: 0
      }
    },
    courseEarnings: {
      total: {
        type: Number,
        default: 0
      },
      pending: {
        type: Number,
        default: 0
      }
    },
    cohortEarnings: {
      total: {
        type: Number,
        default: 0
      },
      pending: {
        type: Number,
        default: 0
      }
    }
  },
  sessionPricing: {
    expertFee: {
      type: Number,
      // required: true,
      default: 0
    },
    platformFee: {
      type: Number,
      required: false,
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
  }]
}, {
  toJSON: { getters: true },
  toObject: { getters: true },
  timestamps: true
});

ExpertSchema.pre('save', function (next) {
  if (this.authType === 'email' && !this.password) {
    return next(new Error('Password is required for email signup'));
  }
  next();
});

export default mongoose.model("Expert", ExpertSchema);