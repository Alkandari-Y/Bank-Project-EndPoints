const router = require("express").Router();
const passport = require("passport");
const { validate } = require("express-validation");
const {
  amountValidationSchema,
} = require("../../../utils/validators/account.validators");
const populateUserAccount = require("../../../middlewares/banks/populateUserAccount");

const {
  getAccountByUserName,
  getUserAccount,
  getUserTransactions,
  depositAmount,
  withdrawAmount,
  transferAmount,
} = require("./account.controllers");

router.param("username", async (req, res, next, username) => {
  try {
    const foundUser = await getAccountByUserName(username);
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
  getUserAccount
);

router.get(
  "/transactions",
  passport.authenticate("jwt", { session: false }),
  getUserTransactions
);

router.post(
  "/deposit",
  passport.authenticate("jwt", { session: false }),
  validate(
    amountValidationSchema,
    { context: false, statusCode: 400, keyByField: true },
    { abortEarly: true }
  ),
  populateUserAccount,
  depositAmount
);

router.post(
  "/withdraw",
  passport.authenticate("jwt", { session: false }),
  validate(
    amountValidationSchema,
    { context: false, statusCode: 400, keyByField: true },
    { abortEarly: true }
  ),
  populateUserAccount,
  withdrawAmount
);
router.post(
  "/transfer/:username",
  passport.authenticate("jwt", { session: false }),
  validate(
    amountValidationSchema,
    { context: false, statusCode: 400, keyByField: true },
    { abortEarly: true }
  ),
  populateUserAccount,
  transferAmount
);

module.exports = router;
