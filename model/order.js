const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugin");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
    },
    unit: {
      type: String,
      enum: ["mg", "gm", "kg", "ml", "ltr", "ton"],
    },
    size: {
      type: Number,
    },
    price: {
      type: Number,
      require: true,
    },
    siblingId: {
        type: String,
        require: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
