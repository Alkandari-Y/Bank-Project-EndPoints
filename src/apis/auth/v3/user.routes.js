const router = require("express").Router();
const multer = require("multer")
const imageUpload = require("../../../middlewares/uploads/imageUpload");
const imageToBody = require("../../../middlewares/uploads/imageToBody");
const validationWrapper = require("../../../utils/wrappers/validationWrapper");
const authSchemas = require("../../../utils/validators/auth.validators");
const authControllers = require("./user.controllers");
const passportAuthenticator = require("../../../middlewares/auth/passportAuth");

router.post(
  "/login",
  multer().none(),
  validationWrapper(authSchemas.loginValidationSchema),
  passportAuthenticator("local"),
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
  "/refresh",
  passportAuthenticator("jwt", refresh=true),
  authControllers.refreshJWTTokens
);

router.get(
  "/users",
  authControllers.getUsers
);

router.get(
  "/profile",
  passportAuthenticator("jwt"),
  authControllers.getLoggedInUserProfile
);

router.put(
  "/profile",
  passportAuthenticator("jwt"),
  imageUpload.single("image"),
  imageToBody,
  validationWrapper(authSchemas.userValidationSchema),
  authControllers.updateUserProfile
);

module.exports = router;
