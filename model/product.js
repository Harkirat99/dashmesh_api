const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugin");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    stock: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Stock",
      required: true,
    },
    supplier: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Supplier",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["mg", "gm", "kg", "ml", "ltr", "ton"],
    },
    price: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    leftQuantity: {
      type: Number,
    },
    salt: {
      type: String,
    },
    expiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
