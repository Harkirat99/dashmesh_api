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

const update = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().allow(""),
    address: Joi.string().allow(""),
    number: Joi.any().allow(""),
    account: Joi.string().allow(null),
    ifsc: Joi.string().allow(null),
    id: Joi.string().allow(""),
  }),
};

module.exports = {
  create,
  update
};