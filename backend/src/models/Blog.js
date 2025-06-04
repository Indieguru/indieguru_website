import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['startup', 'business', 'technology', 'economy'],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert',
        required: true
    },
    expertName: String,
    expertTitle: String,
    publishDate: {
        type: Date,
        default: Date.now
    },
    images: [{
        url: String,
        caption: String
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Populate expert details before saving
BlogSchema.pre('save', async function(next) {
    try {
        if (this.createdBy) {
            const Expert = mongoose.model('Expert');
            const expert = await Expert.findById(this.createdBy);
            if (expert) {
                this.expertName = `${expert.firstName} ${expert.lastName}`;
                this.expertTitle = expert.title;
            }
        }
    } catch (error) {
        console.error('Error populating expert details:', error);
    }
    next();
});

export default mongoose.model('Blog', BlogSchema);