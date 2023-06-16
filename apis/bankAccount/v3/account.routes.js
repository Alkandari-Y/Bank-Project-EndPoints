const router = require("express").Router();
const multer = require("multer")
const passportAuthenticator = require("../../../middlewares/auth/passportAuth")
const validationWrapper = require("../../../utils/wrappers/validationWrapper");
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


router.post(
  "/create-account",
  passportAuthenticator("jwt"),
  multer().none(),
  validationWrapper(accountSchemas.createAccountValidationSchema),
  populateUserAccount,
  accountControllers.createBankAccount
);

router.get(
  "/balance",
  passportAuthenticator("jwt"),
  populateUserAccount,
  accountControllers.getUserAccount
);

router.get(
  "/transactions",
  passportAuthenticator("jwt"),
  accountControllers.getUserTransactions
);

router.post(
  "/deposit",
  passportAuthenticator("jwt"),
  multer().none(),
  validationWrapper(accountSchemas.amountValidationSchema),
  populateUserAccount,
  accountControllers.depositAmount
);

router.post(
  "/withdraw",
  passportAuthenticator("jwt"),
  multer().none(),
  validationWrapper(accountSchemas.amountValidationSchema),
  populateUserAccount,
  accountControllers.withdrawAmount
);
router.post(
  "/transfer/:username",
  passportAuthenticator("jwt"),
  multer().none(),
  validationWrapper(accountSchemas.amountValidationSchema),
  populateUserAccount,
  accountControllers.transferAmount
);

router.get(
  "/user-accounts",
  passportAuthenticator("jwt"),
  accountControllers.getUsersAndAccounts
);

module.exports = router;
