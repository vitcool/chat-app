const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words');

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
  socket.broadcast.emit('message', 'A new user has joined!');

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.emit('message', message);
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    const { latitude, longitude } = location;
    const message = `https://google.com/maps?q=${latitude},${longitude}`;
    io.emit('locationMessage', message);
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', 'User has left');
  });
});
