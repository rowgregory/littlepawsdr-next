import mongoose, { Document, Types } from "mongoose";
import argon2 from "argon2";

export interface User extends Document {
  _id: Types.ObjectId;
  campaigns: Types.ObjectId[];
  adoptFees: Types.ObjectId[];
  donations: Types.ObjectId[];
  paymentProfiles: Types.ObjectId[];
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipPostalCode?: string;
    country?: string;
  };
  lastLoginTime?: string;
  firstNameFirstInitial?: string;
  lastNameFirstInitial?: string;
  firstName?: string;
  lastName?: string;
  anonymousBidding?: boolean;
  registrationConfirmationEmailSent?: boolean;
  hasSavedPaymentMethod?: boolean;
  matchPassword(password: string): Promise<boolean>;

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    adoptFees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdoptionFee",
      },
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
    paymentProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentProfile",
      },
    ],
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isAdmin: { type: Boolean, required: true, default: false },
    shippingAddress: {
      name: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipPostalCode: { type: String },
      country: { type: String },
    },
    lastLoginTime: { type: String },
    firstNameFirstInitial: { type: String },
    lastNameFirstInitial: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    anonymousBidding: { type: Boolean, default: false },
    registrationConfirmationEmailSent: { type: Boolean, default: false },
    hasSavedPaymentMethod: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await argon2.verify(this.password, enteredPassword);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  this.password = await argon2.hash(this.password);
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
