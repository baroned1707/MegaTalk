const express = require("express");
const app = express();
const index = require("./router/index");
const cors = require("cors");
const { writeLog } = require("./base/until");

var whiteList = [];

var corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("400:Not allowed by CORS"));
    }
  },
}; // add cors in whiteList

app.use(express.json());
app.use(
  cors({
    origin: "*", //enable all cors
  })
);
app.use("/api", index);
app.use((req, res, next) => {
  next(new Error(`404:Not found endpoint !`));
});
app.use((err, req, res, next) => {
  var error = err.message;
  var code = error.slice(0, error.indexOf(":"));
  var message = error.slice(error.indexOf(":") + 1, error.length);
  writeLog(code, message, req);
  res.status(code).json(message);
});

module.exports = app;
