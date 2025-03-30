const Joi = require("joi");

const create = {
  body: Joi.object().keys({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    name: Joi.string().required()
  })
};

module.exports = {
  create
};