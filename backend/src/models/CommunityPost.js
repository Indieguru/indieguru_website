import mongoose from 'mongoose';

const CommunityPostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['Referrals by community', 'Freelance projects', 'Ask Me Anything', 'Threads'],
        required: true
    },
    images: [{
        type: String,
        validate: {
            validator: function(arr) {
                return this.images.length <= 3;
            },
            message: 'Maximum of 3 images are allowed per post'
        }
    }],
    isAnonymous: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'authorModel'
    },
    authorModel: {
        type: String,
        required: true,
        enum: ['User', 'Expert']
    },
    authorName: String,
    authorPicture: String
}, {
    timestamps: true
});

// Populate author details before saving
CommunityPostSchema.pre('save', async function(next) {
    try {
        if (!this.isAnonymous && this.author) {
            const Model = mongoose.model(this.authorModel);
            const author = await Model.findById(this.author);
            if (author) {
                this.authorName = `${author.firstName} ${author.lastName}`.trim();
                this.authorPicture = author.profilePicture || '/placeholder-user.jpg';
            }
        }
    } catch (error) {
        console.error('Error populating author details:', error);
    }
    next();
});

export default mongoose.model('CommunityPost', CommunityPostSchema);