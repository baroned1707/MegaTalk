const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

app.use(
  cors({
    origin: "*", //enable all cors
  })
);

const port = process.env.PORTSOCKET || 3103;
const server = http.createServer(app);
const io = require("socket.io")(server);

server.listen(3103, () => {
  console.log("Socket run port : " + port);
});

io.on("connection", (socket) => {
  console.log("Connect: " + socket.id);
  socket.on("disconnect", () => {
    console.log("Disconnect: " + socket.id);
  });
});

module.exports = {
  io,
};
