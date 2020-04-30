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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const formatTime = (time) => moment(time).format("HH:mm");

const autoscroll = () => {
  // new message eleemtn
  const $newMessage = $messages.lastElementChild;

  // get height of last message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visible height
  const visibleHeight = $messages.offsetHeight;

  //height of messages
  const containerHeight = $messages.scrollHeight;

  //how far i scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  const { username, text, createdAt } = message;
  const html = Mustache.render(messageTemplate, {
    username,
    message: text,
    createdAt: formatTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (location) => {
  const { username, link, createdAt } = location;
  const html = Mustache.render(locationTemplate, {
    username,
    link,
    createdAt: formatTime(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
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
      return alert(`Received the following error - ${error}`);
    }
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
      });
    },
    () => alert("An error is occured while get location"),
    { timeout: 10000 }
  );
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
