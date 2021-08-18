const http = require("http");
const https = require("https");
const app = require("../app");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

var port = process.env.PORT || 3102;
var portSSL = process.env.PORTSSL || 3101;

const cert = fs.readFileSync(path.join(__dirname, "../www") + "/cert.pem", "utf-8");
const key = fs.readFileSync(path.join(__dirname, "../www") + "/privkey.pem", "utf-8");
const ca = fs.readFileSync(path.join(__dirname, "../www") + "/chain.pem", "utf-8");

var option = {
  cert,
  key,
  ca,
};

const server = http.createServer(app);
const serverSSL = https.createServer(option, app);

server.listen(port, () => {
  console.log("Server run port : " + port);
});

// serverSSL.listen(portSSL, () => {
//   console.log("Server run portSSL : " + portSSL);
// });
