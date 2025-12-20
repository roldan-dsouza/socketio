import { Socket } from "engine.io-client";

const sendBtn = document.querySelector(".send");
const joinBtn = document.querySelector(".join");
const messageInput = document.querySelector(".message-input");
const roomInput = document.querySelector(".room-input");
const chatBox = document.querySelector(".chat-box");
let socket;

sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit("chatMessage", { message });
  socket.on("chatMessage", ({ room, message }) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.textContent = `Room [${room}]: ${message}`;
    chatBox.appendChild(messageDiv);
  });

  socket.emit("chatMessage", { roomId: room, message });
});

joinBtn.addEventListener("click", () => {
  if (!roomInput.value.trim()) {
    alert("Please enter a room name.");
    return;
  }
  socket = io("http://localhost:8080");
  const room = roomInput.value.trim();
  socket.emit("joinRoom", { roomId: room });

  socket.on("roomInvalid", ({ roomId: room, message }) => {
    alert(`Cannot join room "${room}": ${message}`);
  });
});
