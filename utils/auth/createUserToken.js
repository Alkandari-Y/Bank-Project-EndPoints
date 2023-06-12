require("dotenv").config();

const jwt = require("jsonwebtoken");
const { JWT_EXP } = require("../../config/jwtKeys");

module.exports = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    exp: JWT_EXP,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
