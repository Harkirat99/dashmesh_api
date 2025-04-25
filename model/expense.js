const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugin');

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    partner: {
      type: String,
      enum: ["Harmeet", "Sandeep"],
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
expenseSchema.plugin(toJSON);
expenseSchema.plugin(paginate);


/**
 * @typedef Expense
 */
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;