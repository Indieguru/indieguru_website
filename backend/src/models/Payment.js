import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    //type
    //expert fee
    //student id
    //expert id
    // date
    //total
    //platfrom fee
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemType',
        required: true
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Course', 'Cohort', 'Session'] 
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'attempted', 'paid', 'failed'],
        default: 'created'
    },
    paymentResponse: {
        type: mongoose.Schema.Types.Mixed // Store the complete Razorpay response
    }
}, {
    timestamps: true
});

// Index for faster queries
PaymentSchema.index({ userId: 1, itemId: 1 });
PaymentSchema.index({ 'razorpay.orderId': 1 });
PaymentSchema.index({ 'razorpay.paymentId': 1 });

export default mongoose.model("Paymentsss", PaymentSchema);