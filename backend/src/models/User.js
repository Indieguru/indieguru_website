import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  profilePicture: {
    type: String,
    default: '/placeholder-user.jpg',
    // Add a setter to handle object values
    set: function(value) {
      // If value is an object with url property, extract the url
      if (typeof value === 'object' && value !== null && value.url) {
        return value.url;
      }
      // Otherwise return the value as is
      return value;
    }
  },
  email: {
    type: String,
    unique: true,
  },
  emailOtp: String,
  emailVerified: { type: Boolean, default: false },
  phone: {
    type: String,
    sparse: true, // Allows null values while maintaining uniqueness
  },
  phoneVerified: { 
    type: Boolean, 
    default: false 
  },
  authType: {
    type: String,
    required: true,
    enum: ['gmail', 'phone', 'email'],
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
      // enum: [
      //   'undergraduate',
      //   'working', 
      //   'postgraduate',
      //   'highschool',
      //   'secondary',
      //   null,
      //   ''
      // ],
      default: null
    },
    stream: {
      type: String,
      // enum: ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts/Humanities', null, ''],
      default: null
    },
    degree: String,
    linkedinUrl: String,
    fullName: String,
    phoneNumber: String,
    email: String,
    cityOfResidence: String,
    confusion: {
      type: Number,
      min: 1,
      max: 10
    },
    careerJourney: {
      type: String,
      // enum: ['validate', 'clarity', 'explore', 'guidance'],
      default: null
    },
    learningStyle: {
      type: String,
      // enum: ['oneOnOne', 'selfPaced', 'structured', 'group', 'other']
    },
    otherLearningStyle: String,
    guidanceFor: {
      type: String
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  careerFlow: {
    currentRole: {
      type: String,
      // enum: ['undergraduate', 'working', 'postgraduate', 'highschool', 'secondary'],
    },
    degree: String,
    stream: String,
    linkedinUrl: String,
    careerJourney: {
      type: String,
      // enum: ['validate', 'clarity', 'explore', 'guidance'],
      default: null
    },
    learningStyle: {
      type: String,
      // enum: ['oneOnOne', 'selfPaced', 'structured', 'group', 'other']
    },
    otherLearningStyle: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

UserSchema.pre('save', function (next) {
  // For traditional email-password signup
  if (this.authType === 'email' && !this.password && !this.emailVerified) {
    return next(new Error('Password is required for email signup'));
  }
  // For phone signup
  if (this.authType === 'phone' && !this.phone) {
    return next(new Error('Phone number is required for phone signup'));
  }
  next();
});

export default mongoose.model("User", UserSchema);