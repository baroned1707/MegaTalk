const router = require("express").Router();
const { auth } = require("../base/middleware");
const { handleSendNewMess } = require("../controller/chat");

router.route("/sendnewmess").post(auth, handleSendNewMess);

module.exports = router;
