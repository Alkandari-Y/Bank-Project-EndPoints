
const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_EXP,
  JWT_REFRESH_EXP,
  JWT_SECRET,
} = require("../../config/auth/jwtKeys");


module.exports = (user, tokenType) => {
    const payload = {
      _id: user._id,
      type: tokenType === "access" ? "access" : "refresh",
      username: user.username,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: tokenType === "access" ? 60 * 60 * 5 : 60 * 60 * 24 * 5,
    });
    return token;
  }