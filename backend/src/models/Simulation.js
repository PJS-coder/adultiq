import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  simulationType: {
    type: String,
    required: true,
    enum: ['salary-negotiation', 'job-interview', 'lease-negotiation', 'budget-crisis', 'career-change', 'family-conflict'],
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
  },
  conversationHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  xpEarned: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Simulation', simulationSchema);
