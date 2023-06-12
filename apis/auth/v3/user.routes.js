const router = require("express").Router();
const imageUpload = require("../../../middlewares/uploads/imageUpload");
const imageToBody = require("../../../middlewares/uploads/imageToBody");
const validationWrapper = require("../../../middlewares/wrappers/validationWrapper");
const passport = require("passport");
const authSchemas = require("../../../utils/validators/auth.validators");
const authControllers = require("./user.controllers");

router.post(
  "/login",
  validationWrapper(authSchemas.loginValidationSchema),
  passport.authenticate("local", { session: false }),
  authControllers.login
);
router.post(
  "/register",
  imageUpload.single("image"),
  imageToBody,
  validationWrapper(authSchemas.registrationValidationSchema),
  authControllers.register
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  authControllers.getLoggedInUserProfile
);

router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  authControllers.getUsers
);

router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  imageUpload.single("image"),
  imageToBody,
  validationWrapper(authSchemas.userValidationSchema),
  authControllers.updateUserProfile
);

module.exports = router;
