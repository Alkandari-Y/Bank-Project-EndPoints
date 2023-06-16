require("dotenv").config();
require("./config/db/connectDb")();
const PORT = process.env.PORT || 8000;

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

const rateLimiterConfig = require("./config/app/rateLimiterConfig")
const { localStrategy, jwtStrategy } = require("./config/auth/passport");
const notFoundHandler = require("./middlewares/errors/notFoundHandler");
const errorHandler = require("./middlewares/errors/errorHandler");
const authRoutes = require("./apis/auth/v3/user.routes");
const bankAccountRoutes = require("./apis/bankAccount/v3/account.routes");

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

app.use("/api/auth/v3", authRoutes);
app.use("/api/bank/v3", bankAccountRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
