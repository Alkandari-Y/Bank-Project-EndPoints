require("dotenv").config();

const jwt = require("jsonwebtoken");
const { JWT_EXP } = require("../../config/jwtKeys");

module.exports = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  return token;
};
