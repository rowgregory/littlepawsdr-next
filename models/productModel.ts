import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    images: {
      type: [String],
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    isOutofStock: {
      type: Boolean,
    },
    size: {
      type: String,
    },
    sizes: {
      type: Array,
      default: null,
    },
    hasSizes: {
      type: Boolean,
      default: false,
    },
    isPhysicalProduct: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
