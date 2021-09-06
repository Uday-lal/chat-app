const socket = io();
const chat_box = document.getElementById("chat-box");
let username;


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
	if (event.keyCode ===  13 && message) {
		socket.emit("message", {message: message, username: username});
		chat_box.value = "";
	}
});
