const router = require("express").Router();
const { auth, upload } = require("../base/middleware");
const {
  handleSendNewMess,
  handleSendMessByRoomID,
  handleSeeder,
  handleRecall,
  handleUploadFile,
  handleAddMemberGroup,
  handleDeleteMemeberGroup,
  handleDeleteMess,
  handleDeleteBoxChat,
} = require("../controller/chat");

router.route("/sendnewmess").post(auth, handleSendNewMess);
router.route("/sendmessbyroomid").post(auth, handleSendMessByRoomID);
router.route("/seender").post(auth, handleSeeder);
router.route("/recall").post(auth, handleRecall);
router
  .route("/uploadfile")
  .post(auth, upload.single("filename"), handleUploadFile);
router
  .route("/managermembertogroup")
  .post(auth, handleAddMemberGroup)
  .delete(auth, handleDeleteMemeberGroup);
router.route("/deletemess").delete(auth, handleDeleteMess);
router.route("/deletboxchat").delete(auth, handleDeleteBoxChat);

module.exports = router;
