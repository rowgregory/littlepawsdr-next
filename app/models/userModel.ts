import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
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
  },
  {
    timestamps: true,
  }
);

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", userSchema);

export default User;
