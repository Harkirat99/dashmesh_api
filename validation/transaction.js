const Joi = require("joi");
const { objectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    date: Joi.string().required().label('Date'),
    customer: Joi.string().required().custom(objectId).label('Customer'),
    amount: Joi.number().required().label('Amount'),
    category: Joi.string().required().label('Category'),
    paymentType: Joi.string().required().min(1).label('Payment type').valid("cash", "online"),
  }),
};

const update = {
  params: Joi.object().keys({
    transactionId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    date: Joi.string().label('Date'),
    amount: Joi.number().label('Amount'),
    category: Joi.string().label('Category').valid("discount", "intrest", "purchase"),
    paymentType: Joi.string().label('Payment type').valid("cash", "online"),
  }).min(1), // at least one field must be provided
};

const deleteTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  create,
  update,
  deleteTransaction,
};