const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// const RpsGame = require("./rps-game");

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

io.on("connection", (socket) => {
  socket.emit("message", "Yo!");

  /*

  if (waitingPlayer) {
    new Game(waitingPlayer, socket);
    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
    waitingPlayer.emit("message", "Waiting for an opponent");
  }

  socket.on("message", (text) => {
    io.emit("message", text);
  });

  */
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(8080, () => {
  console.log("RPS started on 8080");
});
