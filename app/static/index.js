const socket = io();
const chat_box = document.getElementById("chat-box");
const messages = document.getElementById("messages");
const date = new Date();
let username;

function getTime() {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hours}:${minutes}`;
  return time;
}

function getDate() {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function createSendMessageBubble(messageData) {
  const msg = document.createElement("DIV");
  const msgHeader = document.createElement("DIV");
  const msgBody = document.createElement("DIV");
  const time = document.createElement("SPAN");
  const date = document.createElement("SPAN");
  const usernameSpan = document.createElement("SPAN");
  const message = document.createElement("SPAN");
  msg.className = "send-message message";
  msgHeader.className = "msg-header";
  msgBody.className = "msg-body";

  // Setting header properties
  time.className = "time";
  time.innerHTML = messageData.time;
  usernameSpan.className = "username";
  usernameSpan.innerHTML =
    messageData.username === username ? "You" : messageData.username;
  msgHeader.appendChild(time);
  msgHeader.appendChild(usernameSpan);

  // Setting body properties
  date.className = "date";
  date.innerHTML = messageData.date === getDate() ? "Today" : messageData.date;
  message.className = "msg";
  message.innerHTML = messageData.message;
  msgBody.appendChild(date);
  msgBody.appendChild(message);

  // Setting message properties
  msg.appendChild(msgHeader);
  msg.appendChild(document.createElement("HR"));
  msg.appendChild(msgBody);

  return msg;
}

function createReceiveMessageBubble(messageData) {
  // ...
}

socket.on("receive", (data) => {
  console.log(data);
});

socket.on("connect", () => {
  socket.emit("connection");
});

socket.on("connection_details", (user_data) => {
  if (!username) {
    username = user_data.username;
  }
});

socket.on("disconnect", () => {
  socket.emit("disconnection");
});

document.addEventListener("keyup", (event) => {
  const message = chat_box.value;
  if (event.keyCode === 13 && message) {
    const time = getTime();
    const date = getDate();
    const msgData = {
      message: message,
      username: username,
      time: time,
      date: date,
    };
    const sendMessageBubble = createSendMessageBubble(msgData);
    socket.emit("message", msgData);
    chat_box.value = "";
    messages.appendChild(sendMessageBubble);
  }
});
