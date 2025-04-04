const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugin");

const stockSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    supplier: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Supplier",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    orderValue: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    additionalCharges: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

/**
 * @typedef Season
 */
const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
