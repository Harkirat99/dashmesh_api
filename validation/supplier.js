const Joi = require("joi");
const { number } = require("./custom");

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    number:  Joi.string().required(),
    account: Joi.string().allow(null),
    ifsc: Joi.string().allow(null),
  })
};

module.exports = {
  create
};