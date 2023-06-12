const { ValidationError } = require("express-validation");

module.exports = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ ...err, details: err.details[0] });
  }
  return res.status(err.status || 500).json({
    name: err.name || "Internal Server Error",
    message: err.message || "something went wrong",
  });
};
