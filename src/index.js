const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const { sendMessage } = require("./utils");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const Filter = require("bad-words");

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New Websocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit("delivery", sendMessage("Admin", "welcome !!"));
    socket.broadcast
      .to(user.room)
      .emit("delivery", sendMessage("Admin", `${user.username} has joined :)`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("msg", (msg, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback("Dont be rude :/");
    }
    io.to(user.room).emit("delivery", sendMessage(user.username, msg));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.emit("delivery", sendMessage("Admin", `${user.username} left :(`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
