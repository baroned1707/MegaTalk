const router = require("express").Router();
const test = require("./test");
const auth = require("./auth");
const { io } = require("../config/socket");

router.use("/test", test);
router.use("/auth", auth);

module.exports = router;
