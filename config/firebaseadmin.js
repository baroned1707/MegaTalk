var admin = require("firebase-admin");
var serviceAccount = require("../key/firebaseadminkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "megatalk-a65f4.appspot.com/",
});

module.exports = { admin };
