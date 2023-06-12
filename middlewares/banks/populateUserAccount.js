module.exports = async (req, res, next) => {
  try {
    req.user = await req.user.populate("account");
    next();
  } catch (err) {
    next(err);
  }
};
