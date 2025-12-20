const sendBtn = document.querySelector(".send");
const joinBtn = document.querySelector(".join");
const messageInput = document.querySelector(".message-input");
const roomInput = document.querySelector(".room-input");
const chatBox = document.querySelector(".chat-box");
const usernameInput = document.querySelector(".username-input");
let socket;

function connectMessages() {
  socket.on("chatMessage", ({ user, room, message }) => {
    console.log(`Message in room ${room} from ${user}: ${message}`);
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.textContent = `${user}: ${message}`;
    chatBox.appendChild(msgDiv);
  });
}

joinBtn.addEventListener("click", () => {
  if (!roomInput.value.trim()) {
    alert("Please enter a room name.");
    return;
  }

  if (!usernameInput.value.trim()) {
    alert("Please enter a username.");
    return;
  }

  socket = io("http://localhost:8080");

  const room = roomInput.value.trim();
  const username = usernameInput.value.trim();

  socket.emit("joinRoom", { roomId: room, username });

  socket.on("roomInvalid", ({ roomId: room, message }) => {
    alert(`Cannot join room "${room}": ${message}`);
    return;
  });

  connectMessages();
});

sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit("chatMessage", { message });
});
