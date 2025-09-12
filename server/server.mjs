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

  socket.on("joinRoom", ({ room }) => {
    if (!validRooms.includes(room)) {
      socket.emit("roomInvalid", "Room does not exist!");
      return;
    }

    socket.join(room);
    console.log(`User joined room: ${room}`);
    socket.emit("roomValid", { room });
  });

  socket.on("chatMessage", ({ room, message }) => {
    io.to(room).emit("chatMessage", { room, message });
  });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:3000");
});
