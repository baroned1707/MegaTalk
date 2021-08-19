const router = require("express").Router();
const { auth } = require("../base/middleware");
const {
  handleLogin,
  handleRegister,
  handleActiveUser,
  handleForgotPass,
  handleResetPass,
} = require("../controller/auth");

router.route("/login").post(handleLogin);
router.route("/register").post(handleRegister);
router.route("/activeuser").post(handleActiveUser);
router.route("/forgotpass").post(handleForgotPass);
router.route("/resetpass").post(handleResetPass);

module.exports = router;
