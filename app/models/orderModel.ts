import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // model for all products, ecards, products, welcome wieners
    orderItems: [
      {
        price: { type: Number, required: true },
        subtotal: { type: String },
        productId: { type: String },
        productImage: { type: String },
        productName: { type: String },
        quantity: { type: Number },
        email: { type: String },

        // product specific field
        shippingPrice: { type: String },
        size: { type: String },
        isPhysicalProduct: { type: Boolean },
        isShipped: { type: Boolean, default: false },

        // welcome wiener specific fields
        dachshundId: { type: String },
        dachshundImage: { type: String },
        dachshundName: { type: String },
        productIcon: { type: String },

        // ecard specific fields
        recipientsFullName: { type: String },
        recipientsEmail: { type: String },
        dateToSend: { type: Date },
        firstName: { type: String },
        lastName: { type: String },
        message: { type: String },
        isSent: { type: String },
        status: { type: String },
        image: { type: String },
        name: { type: String },
        sendNow: { type: String },
        isEcard: { type: Boolean },
        isWelcomeWiener: { type: Boolean },
        isProduct: { type: Boolean },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    paypalOrderId: { type: String, required: true },
    email: { type: String, required: true },
    confirmationEmailHasBeenSent: { type: Boolean, default: false },
    orderShippedconfirmationEmailHasBeenSent: { type: Boolean },
    orderNotificationEmailHasBeenSent: { type: Boolean },

    // physical product fields
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipPostalCode: { type: String },
    },
    shippingPrice: { type: Number, default: 0.0 },
    isShipped: { type: Boolean, default: false },
    shippedOn: { type: Date },
    shippingProvider: { type: String },
    trackingNumber: { type: String },
    requiresShipping: { type: Boolean },
    subtotal: { type: Number },
    totalItems: { type: Number },
    status: { type: String },
    isEcard: { type: Boolean },
    isWelcomeWiener: { type: Boolean },
    isProduct: { type: Boolean },
    processingFee: { type: Number, default: 0.035 },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
