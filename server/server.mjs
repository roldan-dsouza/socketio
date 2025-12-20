import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Example valid rooms
const validRooms = ["alpha", "beta", "cyberpunk"];

io.on("connection", (socket) => {
  console.log("a user connected");
  let room = null;
  let user = null;
  socket.on("joinRoom", ({ roomId, username }) => {
    room = roomId;
    user = username;
    console.log(`${user} attempting to join room: ${room}`);
    if (!validRooms.includes(room)) {
      socket.emit("roomInvalid", { room, message: "Room does not exist!" });
      return;
    }

    socket.join(room);
    console.log(`${user} joined room: ${room}`);
    socket.emit("roomValid", { room });
  });

  socket.on("chatMessage", ({ message }) => {
    console.log(`Message from ${user} in room ${room}: ${message}`);
    io.emit("chatMessage", { user, room, message });
  });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
