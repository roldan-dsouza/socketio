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
  socket.on("joinRoom", ({ roomId }) => {
    room = roomId;
    console.log(`User attempting to join room: ${room}`);
    if (!validRooms.includes(room)) {
      socket.emit("roomInvalid", { room, message: "Room does not exist!" });
      return;
    }

    socket.join(room);
    console.log(`User joined room: ${room}`);
    socket.emit("roomValid", { room });
  });

  socket.on("chatMessage", ({ message }) => {
    io.to(room).emit("chatMessage", { room, message });
  });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:3000");
});
