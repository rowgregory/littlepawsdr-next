import mongoose from "mongoose";

const DogBoostDogSchema = new mongoose.Schema(
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
      ref: "DogBoostProduct",
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    isDogBoost: { type: Boolean, default: true },
    images: [String],
  },
  { timestamps: true }
);

const DogBoostDog =
  mongoose.models.DogBoostDog ||
  mongoose.model("DogBoostDog", DogBoostDogSchema);

export default DogBoostDog;
