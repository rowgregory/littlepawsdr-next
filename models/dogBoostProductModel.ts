import mongoose from "mongoose";

const DogBoostProductSchema = new mongoose.Schema(
  {
    icon: { type: String },
    name: { type: String },
    price: { type: Number },
    description: { type: String },
  },
  { timestamps: true }
);

const DogBoostProduct =
  mongoose.models.DogBoostProduct ||
  mongoose.model("DogBoostProduct", DogBoostProductSchema);

export default DogBoostProduct;
