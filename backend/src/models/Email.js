import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    to: {
        type: String,
        // required: true
    },
    subject: {
        type: String,
        // required: true
    },
    message: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    phone: {
        type: String,
        // required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Email = mongoose.model('Email', emailSchema);