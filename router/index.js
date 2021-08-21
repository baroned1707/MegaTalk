const router = require("express").Router();
const test = require("./test");
const auth = require("./auth");
const chat = require("./chat");
const { io } = require("../config/socket");
const { db } = require("../config/mongodb");
const { admin } = require("../config/firebaseadmin");

// form send notifi cation with fcm token
// admin
//   .messaging()
//   .send({
//     notification: {
//       title: "Baron ED vừa gửi tin nhắn cho bạn",
//       body: "Hello, Nice to meet you !",
//     },
//     data: {
//       name: "BaronED",
//     },
//     token:
//       "cBB3qJ4nQ_O9Pu1Yzx9ZQK:APA91bGQKqlrEAEBWve84_-At--2rlbLQSj1yCVB0ND5H2phyog4Gk32VHHOgjYcZUH4sE2KBn9_Q9pRzN4Skjy9vGybeFAI4Gcs0kaDskMO7AqbML_JJa-xkrCsxuccrReavWp3OmDu",
//   })
//   .then((response) => {
//     // Response is a message ID string.
//     console.log("Successfully sent message:", response);
//   })
//   .catch((error) => {
//     console.log("Error sending message:", error);
//   });

router.use("/test", test);
router.use("/auth", auth);
router.use("/chat", chat);

module.exports = router;
