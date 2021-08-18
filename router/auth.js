const router = require("express").Router();
const { auth } = require("../base/middleware");
const {
  handleLogin,
  handleRegister,
  handleActiveUser,
} = require("../controller/auth");

router.route("/login").post(handleLogin);
router.route("/register").post(handleRegister);
router.route("/activeuser").post(handleActiveUser);

module.exports = router;
