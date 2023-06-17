const router = require("express").Router();
const authRoutes = require("./apis/auth/v3/user.routes");
const bankAccountRoutes = require("./apis/bankAccount/v3/account.routes");

router.use("/auth/v3", authRoutes);
router.use("/bank/v3", bankAccountRoutes);

module.exports = router;
