const socket = io();
const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send");
const messages = document.getElementById("messages");
const peoples = document.getElementById("peoples");
const date = new Date();
let username;

function getTime() {
  const hours = date.getHours();
  const minutes = date.getMinutes() < 10 ? "00" : date.getMinutes();
  const time = `${hours}:${minutes}`;
  return time;
}

function getDate() {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function createMessageBubble(messageData, isSender) {
  const msg = document.createElement("DIV");
  const msgHeader = document.createElement("DIV");
  const msgBody = document.createElement("DIV");
  const time = document.createElement("SPAN");
  const date = document.createElement("SPAN");
  const usernameSpan = document.createElement("SPAN");
  const message = document.createElement("SPAN");
  msg.className = isSender ? "send-message message" : "receive-message message";
  msgHeader.className = "msg-header";
  msgBody.className = "msg-body";

  // Setting header properties
  time.className = "time";
  time.innerHTML = messageData.time;
  usernameSpan.className = "username";
  usernameSpan.innerHTML =
    messageData.username === username ? "You" : messageData.username;
  if (isSender) {
    msgHeader.appendChild(time);
    msgHeader.appendChild(usernameSpan);
  } else {
    msgHeader.appendChild(usernameSpan);
    msgHeader.appendChild(time);
  }

  // Setting body properties
  date.className = "date";
  date.innerHTML = messageData.date === getDate() ? "Today" : messageData.date;
  message.className = "msg";
  message.innerHTML = messageData.message;
  if (isSender) {
    msgBody.appendChild(date);
    msgBody.appendChild(message);
  } else {
    msgBody.appendChild(message);
    msgBody.appendChild(date);
  }

  // Setting message properties
  msg.appendChild(msgHeader);
  msg.appendChild(document.createElement("HR"));
  msg.appendChild(msgBody);

  return msg;
}

function insertPeoples(user_data) {
  const li = document.createElement("LI");
  const connectedUsers = document.getElementById("connected-users");
  li.className = "people";
  li.id = user_data.username;
  connectedUsers.innerHTML = `${user_data.connected_users} people connected`;
  li.innerHTML = user_data.username;
  peoples.appendChild(li);
}

function deletePeople(disconnection_data) {
  const peoples = document.getElementById("peoples");
  const connectedUsers = document.getElementById("connected-users");
  const disconnectedUser = disconnection_data.username;
  const disconnectUserNode = document.getElementById(disconnectedUser);
  peoples.removeChild(disconnectUserNode);
  connectedUsers.innerHTML = `${disconnection_data.connected_users} peoples connected`;
}

socket.on("receive", (data) => {
  const senderName = data.username;
  if (senderName !== username) {
    const messageBubble = createMessageBubble(data, false);
    messages.appendChild(messageBubble);
  }
});

socket.on("connect", () => {
  socket.emit("connection");
});

socket.on("connection_details", (user_data) => {
  // Get the details of users that are connected to the server
  if (!username) {
    username = user_data.username;
  }
});

socket.on("connection_state", (connection_data) => {
  const event = connection_data.event;
  if (event === "connect") {
    if (connection_data.username !== username) {
      insertPeoples(connection_data); // Insert connected users to the ui
    }
  } else if (event === "disconnect") {
    deletePeople(connection_data); // Delete connected users to the ui
  }
});

sendButton.onclick = () => {
  const message = chatBox.value;
  sendButton.className = "button-click";
  if (message) {
    const time = getTime();
    const date = getDate();
    const msgData = {
      message: message,
      username: username,
      time: time,
      date: date,
    };
    const sendMessageBubble = createMessageBubble(msgData, true);
    socket.emit("message", msgData);
    chatBox.value = "";
    messages.appendChild(sendMessageBubble);
  }
};
