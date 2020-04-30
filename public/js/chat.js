const socket = io();

socket.on("message", (message) => {
  console.log(`New message received - ${message}`);
});

const messageForm = document.querySelector("#message-form");
const sendLocation = document.querySelector("#send-location");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { message } = e.target.elements;
  const messageText = message.value;
  socket.emit("sendMessage", messageText, (error) => {
    if (error) {
      return console.log(`Received the following error - ${error}`);
    }
    console.log("Message delivered");
  });
});

sendLocation.addEventListener("click", () => {
  const { geolocation } = navigator;
  if (!geolocation) {
    return alert("Geoloaction is not supported by your browser");
  }

  geolocation.getCurrentPosition(
    (pos) => {
      const { coords } = pos;
      const { latitude, longitude } = coords;
      const obj = { latitude, longitude };
      socket.emit("sendLocation", obj, () => {
        console.log("Location shared!");
      });
    },
    () => console.log("HUI"),
    { timeout: 10000 }
  );
});
