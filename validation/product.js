const Joi = require("joi");
const { objectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    date: Joi.string().required().label('Date'),
    customer: Joi.string().required().custom(objectId).label('Customer'),
    supplier: Joi.string().required().custom(objectId).label('Supplier'),
    name: Joi.string().required(),
    quantity: Joi.number().required().min(1),
    leftQuantity: Joi.number().required(),
    size: Joi.number().required().min(1),
    unit: Joi.string().required().valid("mg", "gm", "kg", "ml", "ltr", "ton"),
    price: Joi.number().positive().min(1).label('Price'),
    totalPrice: Joi.number().positive().min(1).label('Total Price'),
    salt: Joi.string(),
  }),
};

module.exports = {
  create,
};
