const { validate } = require("express-validation");

module.exports = (schema) => {
  return validate(
    schema,
    { context: false, statusCode: 400, keyByField: true },
    { abortEarly: true }
  );
};
