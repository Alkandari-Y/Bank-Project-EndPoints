const { Joi } = require("express-validation");

const amountValidationSchema = {
  body: Joi.object({
    amount: Joi.number().min(1).required(),
  }),
};

module.exports = {amountValidationSchema};
