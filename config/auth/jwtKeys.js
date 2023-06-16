require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXP: process.env.JWT_ACCESS_EXP,
  JWT_REFRESH_EXP: process.env.JWT_REFRESH_EXP,
};
