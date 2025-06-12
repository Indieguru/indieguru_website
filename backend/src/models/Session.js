import mongoose from 'mongoose';
delete mongoose.connection.models['Session'];
const SessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'One-on-One Session'
  },
  studentName: {
    type: String,
    required: false
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
  },
  expertName: String,
  expertTitle: String,
  expertExpertise: [String],
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  pricing: {
    expertFee: {
      type: Number,
      // required: true
    },
    platformFee: {
      type: Number,
      required: false,
      default: 0
    },
    total: {
      type: Number,
      // required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  bookedStatus: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'not booked'],
    default: 'not booked',
  },
  refundProcessed: {
    type: Boolean,
    default: false
  },
  refundRequest: {
    isRequested: {
      type: Boolean,
      default: false
    },
    reason: {
      type: String
    },
    requestDate: {
      type: Date
    },
    supportingDocs: [
      {
        url: { type: String },
        name: { type: String },
        type: { type: String }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminMessage: {
      type: String
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    detail: {
      heading: {
        type: String,
        // required: true
      },
      description: {
        type: String,
        // required: true
      }
    },
    studentName: {
      type: String,
      required: false
    }
  },
  
  eventId: {
    type: String, // Google Calendar event ID
  },
  meetLink: {
    type: String, // Google Meet link
    // required: true,
  },
  notes: {
    text: {
      type: String,
      default: ''
    },
    files: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true }
      }
    ],
    uploadedAt: {
      type: Date
    }
  }
}, { timestamps: true });

// Pre-save hook to calculate total price
SessionSchema.pre('save', function(next) {
  if (this.pricing && this.pricing.expertFee) {
    // Calculate total using existing platform fee or 0
    this.pricing.total = this.pricing.expertFee + (this.pricing.platformFee || 0);
  }
  next();
});

// Pre-save middleware to populate expert details
SessionSchema.pre('save', async function(next) {
  if (this.expert && (!this.expertName || !this.expertTitle || !this.expertExpertise)) {
    try {
      const expertDoc = await mongoose.model('Expert').findById(this.expert);
      if (expertDoc) {
        this.expertName = `${expertDoc.firstName} ${expertDoc.lastName}`;
        this.expertTitle = expertDoc.title;
        this.expertExpertise = expertDoc.expertise;
      }
    } catch (error) {
      console.error('Error populating expert details:', error);
    }
  }
  next();
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;