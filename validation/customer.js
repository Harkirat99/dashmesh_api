const Joi = require("joi");
const { number } = require("./custom");
const create = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    fatherName: Joi.string(),
    number: Joi.string().required().custom(number),
    alternateNumber: Joi.string().allow("").custom(number),
    address: Joi.string().required(),
    status: Joi.string().required().valid('active', 'inactive'),
  }),
};

module.exports = {
  create,
};
