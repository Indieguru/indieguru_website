import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    //type
    //expert fee
    //student id
    //expert id
    //date
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
    expertId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert',
        required: true
    },
    // razorpay: {
    //     orderId: String,
    //     paymentId: String,
    //     signature: String,
    // },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    payemntDate: {
        type: Date,
        default: Date.now
    },
    expertFee: {
        type: Number,
        required: true
    },
    platformFee: {
        type: Number,
        required: true,
        default: 0
    },
  
}, {
    timestamps: true
});

// Index for faster queries
PaymentSchema.index({ userId: 1, itemId: 1 });
// PaymentSchema.index({ 'razorpay.orderId': 1 });
// PaymentSchema.index({ 'razorpay.paymentId': 1 });

export default mongoose.model("Paymentsss", PaymentSchema);

// ANUKUL MODEL
// CHANGE THIS BACK TO Payment/payments and use this one delect the database used in order.js