const socket = io();

// elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

const formatTime = (time) => moment(time).format("HH:mm");

socket.on("message", (message) => {
  console.log(message);
  const { text, createdAt } = message;
  const html = Mustache.render(messageTemplate, {
    message: text,
    createdAt: formatTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (location) => {
  console.log("locationMessage", location);
  const { link, createdAt } = location;
  const html = Mustache.render(locationTemplate, {
    link,
    createdAt: formatTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  const messageText = $messageFormInput.value;

  socket.emit("sendMessage", messageText, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(`Received the following error - ${error}`);
    }
    console.log("Message delivered");
  });
});

$sendLocationButton.addEventListener("click", () => {
  const { geolocation } = navigator;
  if (!geolocation) {
    return alert("Geoloaction is not supported by your browser");
  }
  $sendLocationButton.setAttribute("disabled", "disabled");

  geolocation.getCurrentPosition(
    (pos) => {
      const { coords } = pos;
      const { latitude, longitude } = coords;
      const obj = { latitude, longitude };

      socket.emit("sendLocation", obj, () => {
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location shared!");
      });
    },
    () => console.log("An error is occured"),
    { timeout: 10000 }
  );
});
