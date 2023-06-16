const path = require("path");
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const rateLimiterConfig = require("./config/app/rateLimiterConfig");
const { localStrategy, jwtStrategy } = require("./config/auth/passport");
const notFoundHandler = require("./middlewares/errors/notFoundHandler");
const errorHandler = require("./middlewares/errors/errorHandler");
const routes = require("./routes");

const app = express();

app.use(rateLimiter(rateLimiterConfig));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/media/", express.static(path.join(__dirname, "media")));

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
