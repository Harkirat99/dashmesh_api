const Joi = require("joi");
const { number } = require("./custom");
const create = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    fatherName: Joi.string().allow(""),
    number: Joi.string().required().custom(number),
    alternateNumber: Joi.string().allow("").custom(number),
    address: Joi.string().required(),
    status: Joi.string().required().valid('active', 'inactive'),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    firstName: Joi.string().allow(""),
    lastName: Joi.string().allow(""),
    fatherName: Joi.string().allow(""),
    number: Joi.string().custom(number).allow(""),
    alternateNumber: Joi.string().custom(number).allow(""),
    address: Joi.string().allow(""),
    user: Joi.string().allow(""),
    id: Joi.string().allow(""),
    status: Joi.string().allow(""),
  }),
};

module.exports = {
  create,
  update,
};
