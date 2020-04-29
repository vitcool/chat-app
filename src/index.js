const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const port = process.env.port || 3000;

app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
  console.log(`Server is up and runnig on port ${port}`);
});

let count = 0;

io.on("connection", (socket) => {
  console.log("new WebSocket connection");

  socket.emit('countUpdated', count);

  socket.on("increment", () => {
    count += 1;
    console.log(`the count has been updated - ${count}`);
    // socket.emit('countUpdated', count); - emit event just for particular client
    io.emit('countUpdated', count);
  });
});
