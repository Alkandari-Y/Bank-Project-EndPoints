const { Joi } = require('express-validation')

const username = Joi.string();
const image = Joi.string();
const password = Joi.string().regex(/[a-zA-Z0-9]{8,30}/);

const loginValidationSchema = {
    body: Joi.object({
      username: username
        .required(),
      password: password
            .required(),
    }),
}

const registrationValidationSchema = {
  body: Joi.object({
    username: username
      .required(),
    password: password
          .required(),
    image: image.required()
  }),
}

const userValidationSchema = {
    body: Joi.object({
      password: password
            .optional(),
      image: image.optional()
    }),
}

module.exports = {loginValidationSchema, registrationValidationSchema, userValidationSchema}