require("dotenv").config();
require("./config/connectDb")();
const PORT = process.env.PORT || 8000;

const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const { localStrategy, jwtStrategy } = require("./middlewares/auth/passport");
const notFoundHandler = require("./middlewares/errors/notFoundHandler");
const errorHandler = require("./middlewares/errors/errorHandler");
const authRoutes = require("./apis/auth/v3/user.routes");
const bankAccountRoutes = require("./apis/bankAccount/v3/account.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/media/", express.static(path.join(__dirname, "media")));
app.use(morgan("dev"));

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
