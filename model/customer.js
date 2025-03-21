const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugin');

const customerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    number: {
      type: String,
      required: true,
    },
    alternateNumber: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
customerSchema.plugin(toJSON);
customerSchema.plugin(paginate);

customerSchema.statics.isNumberTaken = async function (number, excludeUserId) {
  const user = await this.findOne({ number, _id: { $ne: excludeUserId } });
  return !!user;
};


/**
 * @typedef Customer
 */
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;