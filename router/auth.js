const router = require("express").Router();
const { auth } = require("../base/middleware");
const {
  handleLogin,
  handleRegister,
  handleActiveUser,
  handleForgotPass,
  handleResetPass,
  handleUpdateProfile,
  handleFindUserByUsername,
  handleFindMultiUserByUsername,
  handleGetProfileUser,
  handleAddFriend,
  handleAcceptFriend,
  handleDeleteFriend,
} = require("../controller/auth");

//
router.route("/login").post(handleLogin);
router.route("/register").post(handleRegister);
router.route("/activeuser").post(handleActiveUser);
router.route("/forgotpass").post(handleForgotPass);
router.route("/resetpass").post(handleResetPass);

//
router.route("/updateprofile").post(auth, handleUpdateProfile);
router.route("/finduserbyusername").post(auth, handleFindUserByUsername);
router
  .route("/findmultiuserbyusername")
  .post(auth, handleFindMultiUserByUsername);
router.route("/getprofileuser").get(auth, handleGetProfileUser);
router
  .route("/addfriend")
  .post(auth, handleAddFriend)
  .put(auth, handleAcceptFriend)
  .delete(auth, handleDeleteFriend);

module.exports = router;
