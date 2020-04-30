const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
  console.log(`Server is up and runnig on port ${port}`);
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { id } = socket;
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(room);
    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(`A new user ${user.username} has joined!`)
      );

    const users = getUsersInRoom(room);
    io.to(room).emit("roomData", {
      room,
      users,
    });
  
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    const user = getUser(socket.id);

    if (!user) {
      return callback("User not found");
    }

    const { room, username } = user;
    io.to(room).emit("message", generateMessage(username, message));
    callback();
  });

  socket.on("sendLocation", (location, callback) => {
    const { latitude, longitude } = location;
    const message = `https://google.com/maps?q=${latitude},${longitude}`;
    const user = getUser(socket.id);

    if (!user) {
      return callback("User not found");
    }

    const { room, username } = user;
    io.to(room).emit(
      "locationMessage",
      generateLocationMessage(username, message)
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      const { room, username } = user;
      io.to(room).emit("roomData", {
        room,
        users: getUsersInRoom(room),
      });
      return io
        .to(room)
        .emit("message", generateMessage(`${username} has left`));
    }
  });
});
