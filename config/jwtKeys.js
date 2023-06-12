require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP: Date.now() + parent(process.env.JWT_EXP),
};
