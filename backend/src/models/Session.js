import mongoose from 'mongoose';


const SessionSchema = new mongoose.Schema({
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  paymentFee: {
    type: Number,
    required: true,
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
  feedback: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;