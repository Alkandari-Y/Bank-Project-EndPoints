const { StatusCodes } = require('http-status-codes');
const { JWT_SECRET } = require("./jwtKeys");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

exports.localStrategy = new LocalStrategy(
  { usernameField: "username" },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username }).select(
        "password username"
      );

      const passwordsMatch = user
        ? await bcrypt.compare(password, user.password)
        : false;

      if (passwordsMatch) return done(null, user);

      return done({
        status: StatusCodes.UNAUTHORIZED,
        name: "Authentication Error",
        message: "Invalid credentials",
      });
    } catch (error) {
      return done(error);
    }
  }
);

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp * 1000) {
      return done({
        status: StatusCodes.UNAUTHORIZED,
        name: "Authentication Error",
        message: "Invalid token",
      });
    }
    try {
      const user = await User.findById(jwtPayload._id);
      done(null, user, jwtPayload);
    } catch (error) {
      done(error);
    }
  }
);
