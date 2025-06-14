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

const update = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    quantity: Joi.number().min(1),
    leftQuantity: Joi.number(),
    size: Joi.number().min(1),
    unit: Joi.string().valid("mg", "gm", "kg", "ml", "ltr", "ton"),
    price: Joi.number().positive().min(1),
    totalPrice: Joi.number().positive().min(1),
    salt: Joi.string(),
    expiry: Joi.date(),
  }).min(1), // at least one field must be provided
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  create,
  update,
  deleteProduct,
};
