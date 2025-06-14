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

const update = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    date: Joi.string().label('Date'),
    customer: Joi.string().custom(objectId).label('Customer'),
    product: Joi.string().custom(objectId),
    quantity: Joi.number().min(1),
    unit: Joi.string().valid("mg", "gm", "kg", "ml", "ltr", "ton"),
    size: Joi.number().min(1),
    price: Joi.number().positive().min(1).label('Price'),
  })
  .min(1), // At least one field must be provided
};

module.exports = {
  create,
  update,
};
