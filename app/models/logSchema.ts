import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  journey: { type: String },
  events: [{
    message: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
  }]
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

export default Log;