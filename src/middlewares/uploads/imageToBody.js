module.exports = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};
