import mongoose, { model, models } from "mongoose";

const logSchema = new mongoose.Schema(
  {
    journey: { type: String },
    events: [
      {
        message: {
          type: String,
          required: true,
        },
        data: {
          type: Object,
          default: {},
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Log = models.Log || model("Log", logSchema);

export default Log;
