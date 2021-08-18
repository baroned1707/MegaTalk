const router = require("express").Router();
const { auth } = require("../base/middleware");
const { handleLogin } = require("../controller/auth");

router.route("/login").post(handleLogin);

module.exports = router;
