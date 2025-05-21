import mongoose from "mongoose";

const eCardSchema = new mongoose.Schema(
  {
    category: { type: String },
    price: { type: Number },
    image: { type: String },
    name: { type: String },
    isEcard: { type: Boolean, default: true },
    thumb: { type: String },
    sendNow: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const ECard = mongoose.model("ECard", eCardSchema);

export default ECard;
