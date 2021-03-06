const socket = io();
const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send");
const messages = document.getElementById("messages");
const peoples = document.getElementById("peoples");
const showPeoples = document.getElementById("show-peoples");
const clear = document.getElementById("clear");
let username;

function getTime(utcTime) {
  const date = new Date(utcTime);
  const hours = date.getHours();
  const minutes = date.getMinutes() < 10 ? "00" : date.getMinutes();
  const time = `${hours}:${minutes}`;
  return time;
}

function getDate(utcTime) {
  const date = new Date(utcTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function removeHTML(message) {
  if (message.includes("<") || message.includes(">")) {
    const lt = "&lt;";
    const gt = "&gt;";
    while (true) {
      if (message.includes("<")) {
        message = message.replace("<", lt);
      } else if (message.includes(">")) {
        message = message.replace(">", gt);
      } else {
        break;
      }
    }
  }
  return message;
}

function createMessageBubble(messageData, isSender, utcTime) {
  const msg = document.createElement("DIV");
  const msgHeader = document.createElement("DIV");
  const msgBody = document.createElement("DIV");
  const time = document.createElement("SPAN");
  const date = document.createElement("SPAN");
  const usernameSpan = document.createElement("SPAN");
  const message = document.createElement("SPAN");
  const innerMessage = removeHTML(messageData.message);
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
  date.innerHTML =
    messageData.date === getDate(utcTime) ? "Today" : messageData.date;
  message.className = "msg";
  message.innerHTML = innerMessage;
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
  const connectedUsersMobile = document.getElementById(
    "connected-users-mobile"
  );
  li.className = "people";
  li.id = user_data.username;
  connectedUsers.innerHTML = `${user_data.connected_users} people connected`;
  connectedUsersMobile.innerHTML = `${user_data.connected_users} people connected`;
  li.innerHTML = user_data.username;
  peoples.appendChild(li);
}

function deletePeople(disconnection_data) {
  const peoples = document.getElementById("peoples");
  const connectedUsers = document.getElementById("connected-users");
  const connectedUsersMobile = document.getElementById(
    "connected-users-mobile"
  );
  const disconnectedUser = disconnection_data.username;
  const disconnectUserNode = document.getElementById(disconnectedUser);
  peoples.removeChild(disconnectUserNode);
  connectedUsers.innerHTML = `${disconnection_data.connected_users} peoples connected`;
  connectedUsersMobile.innerHTML = `${disconnection_data.connected_users} people connected`;
}

function scrollSmoothToBottom(id) {
  var div = document.getElementById(id);
  $("#" + id).animate(
    {
      scrollTop: div.scrollHeight - div.clientHeight,
    },
    500
  );
}

socket.on("receive", (data) => {
  const senderName = data.username;
  if (senderName !== username) {
    const utcTime = new Date().toUTCString();
    const messageBubble = createMessageBubble(data, false, utcTime);
    messages.appendChild(messageBubble);
    scrollSmoothToBottom("chat-container");
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

sendButton.onclick = function () {
  const message = chatBox.value;
  const date = new Date();
  if (message) {
    const utcTime = date.toUTCString();
    const currentDate = getDate(utcTime);
    const time = getTime(utcTime);
    const msgData = {
      message: message,
      username: username,
      date_time: utcTime,
      date: currentDate,
      time: time,
    };
    const sendMessageBubble = createMessageBubble(msgData, true, utcTime);
    socket.emit("message", msgData);
    chatBox.value = "";
    messages.appendChild(sendMessageBubble);
    scrollSmoothToBottom("chat-container");
  }
};

showPeoples.onclick = function () {
  const ul = document.getElementById("nav-links");
  const chatInfo = document.getElementById("connection-info");
  const chatBoxContainer = document.getElementById("chat-box-container");
  ul.className = "hidden";
  clear.style = "display: block;color: ghostwhite;";
  chatInfo.style = `display: block;width: 100vw;overflow: scroll;overflow-x: hidden;overflow-y: scroll;height: 90vh`;
  chatBoxContainer.style = "display: none;";
};

clear.onclick = function () {
  const ul = document.getElementById("nav-links");
  const chatInfo = document.getElementById("connection-info");
  const chatBoxContainer = document.getElementById("chat-box-container");
  ul.classList.remove("hidden");
  clear.style = "display: none";
  chatInfo.style = "display: none;";
  chatBoxContainer.style = null;
};
