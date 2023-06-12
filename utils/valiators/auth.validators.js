const { Joi } = require('express-validation')

const loginValidationSchema = {
    body: Joi.object({
      username: Joi.string()
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{8,30}/)
            .required(),
    }),
}

const registrationValidationSchema = {
  body: Joi.object({
    username: Joi.string()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{8,30}/)
          .required(),
    image: Joi.string().required()
  }),
}

const userValidationSchema = {
    body: Joi.object({
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{8,30}/)
            .optional(),
      image: Joi.string().optional()
    }),
}

module.exports = {loginValidationSchema, registrationValidationSchema, userValidationSchema}