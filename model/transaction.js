const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugin');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
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
    amount: {
        type: Number,
        require: true
    },
    category: {
      type: String,
      enum: ["discount", "intrest", "add"],
      default: "add"
    },
    paymentType: {
        type: String,
        enum: ["cash", "online"],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;