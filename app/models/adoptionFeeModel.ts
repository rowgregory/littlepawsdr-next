import mongoose from "mongoose";

const adoptionFeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailAddress: {
      type: String,
      unique: false,
    },
    state: {
      type: String,
    },
    feeAmount: {
      type: Number,
      default: 15,
    },
    token: {
      type: String,
    },
    confirmationEmailHasBeenSent: {
      type: Boolean,
    },
    bypassCode: {
      type: String,
    },
    exp: {
      type: Number,
    },
    tokenStatus: { type: String, default: "Valid" },
    applicationStatus: { type: String, default: "Active" },
    customerId: { type: String },
    paymentMethodId: { type: String },
  },
  {
    timestamps: true,
  }
);

const AdoptionFee =
  mongoose.models.AdoptionFee ||
  mongoose.model("AdoptionFee", adoptionFeeSchema);

export default AdoptionFee;
