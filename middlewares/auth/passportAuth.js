const { StatusCodes } = require('http-status-codes');
const passport = require("passport");

const passportAuthenticator = (loginType, refresh) => (req, res, next) => {
  passport.authenticate(loginType, (err, user, info) => {
    if (err || !user) return next({
      status: StatusCodes.UNAUTHORIZED,
      name: "Authentication Error",
      message: "Invalid Credentials",
    });
    if (!refresh) {
      if (info?.hasOwnProperty("type") && info.type === "refresh") {
        return next({
          status: StatusCodes.UNAUTHORIZED,
          name: "Authentication Error",
          message: "Invalid access token",
        });
      }
    } else {
      if (info?.hasOwnProperty("type") && info.type === "access") {
        return next({
          status: StatusCodes.UNAUTHORIZED,
          name: "Authentication Error",
          message: "Invalid refresh token",
        });
      }
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = passportAuthenticator;
