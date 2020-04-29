const socket = io();

socket.on("message", (message) => {
  console.log(`New message received - ${message}`);
});

const messageForm = document.querySelector("#message-form");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { message } = e.target.elementsß;
  const messageText = message.value;
  socket.emit("sendMessage", messageText);
});
