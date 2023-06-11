const router = require("express").Router();
const imageUpload = require("../../middlewares/uploads/imageUpload");
const imageToBody = require("../../middlewares/uploads/imageToBody");
const passport = require("passport");
const { validate } = require("express-validation");
const {
    loginValidationSchema,
    registrationValidationSchema,
  userValidationSchema,
} = require("./auth.validators");
const {
  register,
  login,
    getLoggedInUserProfile,
    updateUserProfile
} = require("./user.controllers");

router.post(
  "/login",
  validate(
    loginValidationSchema,
    { context: false, statusCode: 400, keyByField: true },
    { abortEarly: true }
  ),
  passport.authenticate("local", { session: false }),
  login
);
router.post(
  "/register",
  imageUpload.single("image"),
  imageToBody,
  validate(
    registrationValidationSchema,
    { context: false, statusCode: 400, keyByField: true },
    { abortEarly: true }
  ),
  register
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getLoggedInUserProfile
);

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  imageUpload.single("image"),
  imageToBody,
  validate(
    userValidationSchema,
    { context: false, statusCode: 400, keyByField: true },
    { abortEarly: true }
  ),
  updateUserProfile
);

module.exports = router;
