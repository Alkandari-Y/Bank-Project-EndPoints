const { Joi } = require("express-validation");

const amount = Joi.number()

const amountValidationSchema = {
  body: Joi.object({
    amount: amount.min(1).required(),
  }),
};

const createAccountValidationSchema = {
  body: Joi.object({
    amount: amount.min(0).optional(),
  }),
};

module.exports = {amountValidationSchema, createAccountValidationSchema};
