const sendBtn = document.querySelector(".send");
const joinBtn = document.querySelector(".join");
const messageInput = document.querySelector(".message-input");
const roomInput = document.querySelector(".room-input");
const chatBox = document.querySelector(".chat-box");
const usernameInput = document.querySelector(".username-input");
let socket;
let myUsername = "";

function connectMessages() {
  socket?.on("chatMessage", ({ username, message }) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (username === myUsername) {
      messageDiv.classList.add("my-message");
    } else {
      messageDiv.classList.add("other-message");
    }

    messageDiv.innerHTML = `<strong>${username}</strong>: ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
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

  socket = io("http://localhost:8080", { reconnection: false });

  socket.on("joinedRoom", ({ room, user }) => {
    const joinDiv = document.createElement("div");
    joinDiv.classList.add("join-message");
    joinDiv.innerText = `${user} joined room: ${room}`;
    chatBox.appendChild(joinDiv);
  });

  const room = roomInput.value.trim();
  const username = usernameInput.value.trim();
  myUsername = username;

  socket.emit("joinRoom", { roomId: room, username });

  socket.on("roomInvalid", ({ roomId: room, message }) => {
    alert(`Cannot join room "${room}": ${message}`);
    socket.disconnect();
    return;
  });

  connectMessages();
});

sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit("chatMessage", { message });
});

addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
