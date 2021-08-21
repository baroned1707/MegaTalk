const router = require("express").Router();
const test = require("./test");
const auth = require("./auth");
const chat = require("./chat");
const { io } = require("../config/socket");
const { db } = require("../config/mongodb");

router.use("/test", test);
router.use("/auth", auth);
router.use("/chat", chat);

module.exports = router;
