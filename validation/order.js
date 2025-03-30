const Joi = require("joi");
const { objectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    date: Joi.string().required().label('Date'),
    customer: Joi.string().required().custom(objectId).label('Customer'),
    items: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            quantity: Joi.number().required().min(1),
            unit: Joi.string().required().valid("mg", "g", "kg", "ml", "l", "ton"),
            unitAmount: Joi.number().min(1).required(),
            price: Joi.number().positive().min(1).label('Price'),
            // actualPrice: Joi.number().positive().required().min(1).label('Actual Price'),
        })
      ).min(1).required().label('Items')
  }),
};

module.exports = {
  create,
};
