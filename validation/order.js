const Joi = require("joi");
const { objectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    date: Joi.string().required().label('Date'),
    customer: Joi.string().required().custom(objectId).label('Customer'),
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().required().min(1),
            unit: Joi.string().required().valid("mg", "gm", "kg", "ml", "ltr", "ton"),
            size: Joi.number().min(1).required(),
            price: Joi.number().positive().min(1).label('Price'),
        })
      ).min(1).required().label('Items')
  }),
};

module.exports = {
  create,
};
