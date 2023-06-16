const { StatusCodes } = require("http-status-codes");
const expressValidator = require("express-validation");

module.exports = (err, req, res, next) => {
  console.log(err)
  const error = {
    name: err.name || "Internal Server Error",
    message: err.message || "something went wrong",
  };
  if (err.code && err.code === 11000) {
    let message;
    for (const [key, value] of Object.entries(err.keyValue)) {
      message = `${key} ${value}`
    }
    error.name = `Duplicate Error`;
    error.message = `${message} already exists`;
  }

  if (err instanceof expressValidator.ValidationError) {
    error.status = err.statusCode;
    error.details = err.details[0];
  }

  return res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    ...error,
  });
};
