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

io.on("connection", (socket) => {
  socket.emit('message', 'Welcome!');

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
});
