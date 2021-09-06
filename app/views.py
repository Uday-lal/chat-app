from flask import Blueprint, render_template, redirect, url_for, session
from .form import EnterForm
from . import SOCKET_IO
from flask_socketio import emit

views = Blueprint("views", __name__)
connected_users = []


@views.route("/", methods=["GET", "POST"])
def home():
	enter_form = EnterForm()
	if enter_form.validate_on_submit():
		username = enter_form.username.data
		connected_users.append(username)
		session["username"] = username
		return redirect(url_for("views.chat"))
	return render_template("index.html", enter_form=enter_form)


@views.route("/chat")
def chat():
	return render_template("chat.html")


@SOCKET_IO.on("message")
def handle_messages(data):
	print(data)
	emit("receive", data, broadcast=True)


@SOCKET_IO.on("disconnection")
def handle_disconnect():
	print("disconnection happen")


@SOCKET_IO.on("connection")
def handle_connect():
	emit("connection_details", {"username": session["username"]})
