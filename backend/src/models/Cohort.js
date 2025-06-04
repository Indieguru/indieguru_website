import mongoose from "mongoose";

const CohortSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    meetLink: {
        type: String,
        required: true
    },
    purchasedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pricing: {
        expertFee: {
            type: Number,
            required: true
        },
        platformFee: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: null
    },
    activityStatus: {
        type: String,
        enum: ['live', 'completed'],
        default: 'live'
    },
    publishingDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    expertName: String,
    expertTitle: String,
    expertExpertise: [String],
    feedback: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        detail: {
            heading: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        },
        studentName: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Pre-save hook to calculate total price and set currency
CohortSchema.pre('save', function(next) {
    // Ensure pricing object exists
    if (!this.pricing) {
        this.pricing = {
            expertFee: 0,
            platformFee: 0,
            total: 0,
            currency: 'INR'
        };
    }
    
    // Calculate total using existing values
    this.pricing.expertFee = this.pricing.expertFee || 0;
    this.pricing.platformFee = this.pricing.platformFee || 0;
    this.pricing.total = this.pricing.expertFee + this.pricing.platformFee;
    this.pricing.currency = this.pricing.currency || 'INR';
    
    next();
});

// Pre-save middleware to populate expert details
CohortSchema.pre('save', async function(next) {
    if (this.createdBy && (!this.expertName || !this.expertTitle || !this.expertExpertise)) {
        try {
            const expertDoc = await mongoose.model('Expert').findById(this.createdBy);
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

export default mongoose.model("Cohort", CohortSchema);