const router = require("express").Router();
const passport = require("passport");
const validationWrapper = require("../../../middlewares/wrappers/validationWrapper");
const accountSchemas = require("../../../utils/validators/account.validators");
const populateUserAccount = require("../../../middlewares/banks/populateUserAccount");
const accountControllers = require("./account.controllers");

router.param("username", async (req, res, next, username) => {
  try {
    const foundUser = await accountControllers.getAccountByUserName(username);
    if (!foundUser)
      return next({
        status: 404,
        name: "Not Found",
        message: "Account not found!",
      });
    req.receivingAccount = foundUser.account;
    next();
  } catch (err) {
    next(err);
  }
});

router.get(
  "/balance",
  passport.authenticate("jwt", { session: false }),
  populateUserAccount,
  accountControllers.getUserAccount
);

router.get(
  "/transactions",
  passport.authenticate("jwt", { session: false }),
  accountControllers.getUserTransactions
);

router.post(
  "/deposit",
  passport.authenticate("jwt", { session: false }),
  validationWrapper(accountSchemas.amountValidationSchema),
  populateUserAccount,
  accountControllers.depositAmount
);

router.post(
  "/withdraw",
  passport.authenticate("jwt", { session: false }),
  validationWrapper(accountSchemas.amountValidationSchema),
  populateUserAccount,
  accountControllers.withdrawAmount
);
router.post(
  "/transfer/:username",
  passport.authenticate("jwt", { session: false }),
  validationWrapper(accountSchemas.amountValidationSchema),
  populateUserAccount,
  accountControllers.transferAmount
);

module.exports = router;
