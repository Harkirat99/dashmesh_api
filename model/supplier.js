const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugin");

const supplierSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    ifsc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
supplierSchema.plugin(toJSON);
supplierSchema.plugin(paginate);

/**
 * @typedef Supplier
 */
const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
