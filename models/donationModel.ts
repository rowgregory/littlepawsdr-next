import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String }, // optional if you want to store donor name
    lastName: { type: String },
    email: { type: String, required: true },
    donationAmount: { type: Number, required: true }, // in dollars
    currency: { type: String, default: "usd" },
    paymentMethod: { type: String }, // e.g. 'card', 'paypal'
    stripePaymentIntentId: { type: String }, // Stripe PaymentIntent ID for one-time payments
    stripeChargeId: { type: String }, // Stripe charge ID (optional)
    stripeSubscriptionId: { type: String }, // if this donation is part of subscription
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    isSubscription: { type: Boolean, default: false }, // marks subscription donation
    paymentDate: { type: Date }, // when payment succeeded
    refundedDate: { type: Date },
  },
  { timestamps: true }
);

const Donation =
  mongoose.models.Donation || mongoose.model("Donation", donationSchema);

export default Donation;
