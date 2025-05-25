import mongoose from "mongoose";

const paymentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripeCustomerId: { type: String, required: true },
    stripePaymentMethodId: { type: String, required: true },
    last4: { type: String },
    brand: { type: String },
    expMonth: { type: Number },
    expYear: { type: Number },
    isDefault: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PaymentProfile =
  mongoose.models.PaymentProfile ||
  mongoose.model("PaymentProfile", paymentProfileSchema);

export default PaymentProfile;
