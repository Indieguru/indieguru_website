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
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending'
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
            ref: 'User'
        },
        rating: {
            type: Number,
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
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
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