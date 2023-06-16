const { StatusCodes } = require("http-status-codes");
const User = require("../../../models/User");
const asyncWrapper = require("../../../utils/wrappers/asyncWrapper");
const createPasswordHash = require("../../../utils/auth/createPasswordHash");
const createUserToken = require("../../../utils/auth/createUserToken");

exports.register = asyncWrapper(async (req, res, next) => {
  req.body.password = await createPasswordHash(req.body.password);
  const user = await User.create(req.body);
  const token = createUserToken(user);
  return res.status(StatusCodes.CREATED).json(token);
});

exports.login = asyncWrapper(async (req, res) => {
  const token = createUserToken(req.user);
  return res.status(StatusCodes.OK).json(token);
});

exports.refreshJWTTokens = asyncWrapper(async (req, res, next) => {
  const token = createUserToken(req.user);
  return res.status(StatusCodes.OK).json(token);
});

exports.getLoggedInUserProfile = async (req, res) => {
  console.log(req.user)
  return res.status(StatusCodes.OK).json(req.user);
};

exports.updateUserProfile = asyncWrapper(async (req, res) => {
  if (req.body.password) {
    req.body.password = await createPasswordHash(req.body.password);
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(StatusCodes.OK).json(updatedUser);
});

exports.getUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  return res.status(StatusCodes.OK).json(users);
});
