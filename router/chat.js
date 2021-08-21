const router = require("express").Router();
const { auth } = require("../base/middleware");
const {
  handleSendNewMess,
  handleSendMessByRoomID,
} = require("../controller/chat");

router.route("/sendnewmess").post(auth, handleSendNewMess);
router.route("/sendmessbyroomid").post(auth, handleSendMessByRoomID);

module.exports = router;
