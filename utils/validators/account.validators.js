const { Joi } = require("express-validation");

const amount = Joi.number().min(1)

const amountValidationSchema = {
  body: Joi.object({
    amount: amount.required(),
  }),
};

module.exports = {amountValidationSchema};
