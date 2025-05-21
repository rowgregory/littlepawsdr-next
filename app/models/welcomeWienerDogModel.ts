import mongoose from "mongoose";

const welcomeWienerDogSchema = new mongoose.Schema(
  {
    displayUrl: {
      type: String,
    },
    name: {
      type: String,
    },
    bio: {
      type: String,
    },
    age: {
      type: String,
    },
    associatedProducts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "WelcomeWienerProduct",
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    isWelcomeWiener: { type: Boolean, default: true },
    images: [String],
  },
  { timestamps: true }
);

const WelcomeWienerDog =
  mongoose.models.WelcomeWienerDog ||
  mongoose.model("WelcomeWienerDog", welcomeWienerDogSchema);

export default WelcomeWienerDog;
