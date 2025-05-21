import mongoose from 'mongoose';

const actionHistorySchema = new mongoose.Schema(
  {
    actionType: { type: String, required: true },
    user: {
      name: { type: String },
      email: { type: String },
    },
    details: { type: String },
    ip: { type: String },
    deviceInfo: { type: String },

  },
  {
    timestamps: true,
  }
);

const ActionHistory = mongoose.model('ActionHistory', actionHistorySchema);

export default ActionHistory;
