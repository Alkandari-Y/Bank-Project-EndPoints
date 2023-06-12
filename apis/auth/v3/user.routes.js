const router = require("express").Router();
const imageUpload = require("../../../middlewares/uploads/imageUpload");
const imageToBody = require("../../../middlewares/uploads/imageToBody");
const validationWrapper = require("../../../middlewares/wrappers/validationWrapper");
const passport = require("passport");
const {
  loginValidationSchema,
  registrationValidationSchema,
  userValidationSchema,
} = require("../../../utils/validators/auth.validators");
const {
  register,
  login,
  getLoggedInUserProfile,
  updateUserProfile,
} = require("./user.controllers");

router.post(
  "/login",
  validationWrapper(loginValidationSchema),
  passport.authenticate("local", { session: false }),
  login
);
router.post(
  "/register",
  imageUpload.single("image"),
  imageToBody,
  validationWrapper(registrationValidationSchema),
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
  validationWrapper(userValidationSchema),
  updateUserProfile
);

module.exports = router;
