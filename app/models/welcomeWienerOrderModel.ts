import mongoose from "mongoose";

const welcomeWienerOrderSchema = new mongoose.Schema(
  {
    dachshundId: { type: String, required: true },
    productImage: { type: String, required: true },
    dachshundName: { type: String, required: true },
    price: { type: Number, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WelcomeWienerProduct",
    },
    productIcon: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    email: { type: String },
    isPhysicalProduct: { type: Boolean, default: false },
    subtotal: { type: Number },
    totalPrice: { type: Number },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  {
    timestamps: true,
  }
);

const WelcomeWienerOrder =
  mongoose.models.WelcomeWienerOrder ||
  mongoose.model("WelcomeWienerOrder", welcomeWienerOrderSchema);

export default WelcomeWienerOrder;
