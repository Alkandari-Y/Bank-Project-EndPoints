const User = require("../../../db/models/User");
const Account = require("../../../db/models/Account");
const createPasswordHash = require("../../../utils/auth/createPasswordHash");
const createUserToken = require("../../../utils/auth/createUserToken");

exports.register = async (req, res, next) => {
  try {
    req.body.password = await createPasswordHash(req.body.password);

    const user = User(req.body);
    const account = await Account.create({ owner: user._id });
    user.account = account._id;
    await user.save();
    const token = createUserToken(user);
    return res.status(201).json({ access: token });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = createUserToken(req.user);
    return res.status(201).json({ access: token });
  } catch (err) {
    return next(err);
  }
};

exports.getLoggedInUserProfile = async (req, res, next) => {
  return res.status(200).json(req.user);
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await createPasswordHash(req.body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      runValidators: true,
      new: true,
    });
    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await createPasswordHash(req.body.password);
    }
    const users = await User.find().select("username account image");
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
