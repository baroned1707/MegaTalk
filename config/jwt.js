const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");

const signToken = (payLoad) => {
  var keyPath = path.join(
    __dirname.replace("/config", "/key") + "/private.key"
  );
  var privateKey = fs.readFileSync(keyPath).toString();
  var token = jwt.sign(
    { ...payLoad, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, //token exp 24h
    privateKey,
    { algorithm: "RS256" }
  );
  return token;
};

const verifyToken = (token) => {
  var keyPath = path.join(__dirname.replace("/config", "/key") + "/public.key");
  var publicKey = fs.readFileSync(keyPath).toString();
  try {
    var decode = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    return decode;
  } catch (e) {
    return false;
  }
};

module.exports = {
  signToken,
  verifyToken,
};
