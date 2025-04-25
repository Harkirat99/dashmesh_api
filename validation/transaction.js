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

module.exports = {
  create,
};