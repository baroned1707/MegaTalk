const router = require("express").Router();
const { auth, upload } = require("../base/middleware");
const {
  handleSendNewMess,
  handleSendMessByRoomID,
  handleSeeder,
  handleRecall,
  handleUploadFile,
} = require("../controller/chat");

router.route("/sendnewmess").post(auth, handleSendNewMess);
router.route("/sendmessbyroomid").post(auth, handleSendMessByRoomID);
router.route("/seender").post(auth, handleSeeder);
router.route("/recall").post(auth, handleRecall);
router
  .route("/uploadfile")
  .post(auth, upload.single("filename"), handleUploadFile);

module.exports = router;
