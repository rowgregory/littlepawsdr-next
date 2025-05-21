import mongoose from "mongoose";

const welcomeWienerProductSchema = new mongoose.Schema(
  {
    icon: { type: String },
    name: { type: String },
    price: { type: Number },
    description: { type: String },
  },
  { timestamps: true }
);

const WelcomeWienerProduct =
  mongoose.models.WelcomeWienerProduct ||
  mongoose.model("WelcomeWienerProduct", welcomeWienerProductSchema);

export default WelcomeWienerProduct;
