import mongoose from "mongoose";

const errorSchema = new mongoose.Schema(
  {
    functionName: {
      type: String,
    },
    detail: {
      type: String,
    },
    user: {
      id: { type: String },
      name: { type: String },
      email: { type: String },
    },
    state: { type: String },
    status: { type: Number },
    name: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

const Error = mongoose.model("Error", errorSchema);

export default Error;
