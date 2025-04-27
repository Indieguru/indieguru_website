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
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
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
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled','not booked'],
    default: 'not booked',
  },
  feedback: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  eventId: {
    type: String, // Google Calendar event ID
  },
  meetLink: {
    type: String, // Google Meet link
    required: true,
  }
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;