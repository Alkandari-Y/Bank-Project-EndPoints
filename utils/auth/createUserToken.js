const jwt = require("jsonwebtoken");
const { JWT_EXP, JWT_SECRET } = require("../../config/jwtKeys");

module.exports = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXP,
  });
  return token;
};
