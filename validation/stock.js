const Joi = require("joi");
const { objectId } = require("./custom");

const create = {
  body: Joi.object().keys({
    date: Joi.string().required().label('Date'),
    supplier: Joi.string().required().custom(objectId).label('Supplier'),
    additionalCharges: Joi.number().allow(null),
    taxAmount: Joi.number().allow(null),
    products: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            expiry: Joi.string(),
            salt: Joi.string().allow(null),
            quantity: Joi.number().required().min(1),
            unit: Joi.string().required().valid("mg", "gm", "kg", "ml", "ltr", "ton"),
            size: Joi.number().min(1).required(),
            price: Joi.number().positive().min(1).label('Price'),
        })
      ).min(1).required().label('Products')
  }),
};

module.exports = {
  create
};
