const Joi = require("joi");

const create = {
  body: Joi.object().keys({
    partner: Joi.string().valid("Harmeet", "Sandeep").required(),
    date: Joi.string().required().label('Date'),
    amount: Joi.number().required().min(1)
  })
};

module.exports = {
  create
};