import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
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
    driveLink: {
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
    publishingDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Pre-save hook to calculate total price
CourseSchema.pre('save', function(next) {
    if (this.pricing && this.pricing.expertFee) {
        this.pricing.total = this.pricing.expertFee + (this.pricing.platformFee || 0);
    }
    next();
});

export default mongoose.model("Course", CourseSchema);