const User = require("../../models/User");

module.exports = async (req, res, next) => {
  try {
    req.user = await User.findById(req.user._id).select("account").populate("account");
    next();
  } catch (err) {
    next(err);
  }
};
