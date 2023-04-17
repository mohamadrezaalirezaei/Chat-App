const socket = io();

socket.on("delivery", (msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    msg: msg.message,
    createdAt: moment(msg.createdAt).format("h:mm a"),
    username: msg.username,
  });
  messages.insertAdjacentHTML("beforeend", html);
});

const input = document.querySelector("#input");
const sendButton = document.querySelector("#sendMessage");
const messages = document.querySelector("#messages");

//template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

sendButton.addEventListener("click", () => {
  const msg = input.value;
  socket.emit("msg", msg, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered");
  });
  input.value = "";
  input.focus();
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.herf = "/";
  }
});
