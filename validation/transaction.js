const Joi = require("joi");
const { objectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    date: Joi.string().required().label('Date'),
    customer: Joi.string().required().custom(objectId).label('Customer'),
    amount: Joi.number().required().min(1).label('Amount'),
    paymentType: Joi.string().required().min(1).label('Payment type').valid("cash", "online"),
  }),
};

module.exports = {
  create,
};
