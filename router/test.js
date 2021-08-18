const router = require("express").Router();
const { auth } = require("../base/middleware");
const { handleTest } = require("../controller");

router.route("/testapi").get(auth, handleTest);

module.exports = router;
