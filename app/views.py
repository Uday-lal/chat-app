from flask import Blueprint, render_template, redirect, url_for, session
from .form import EnterForm
from . import SOCKET_IO
from flask_socketio import emit
from flask import flash
from .model import Chat
from . import DB

views = Blueprint("views", __name__)
connected_users = []


@views.route("/", methods=["GET", "POST"])
def home():
    enter_form = EnterForm()
    if enter_form.validate_on_submit():
        username = enter_form.username.data
        if username not in connected_users:
            connected_users.append(username)
            session["username"] = username
            return redirect(url_for("views.chat"))
        flash("This name is already taken use a different and unique name")
        return redirect(url_for("views.home"))
    return render_template("index.html", enter_form=enter_form)


@views.route("/chat")
def chat():
    return render_template("chat.html",
                           peoples=connected_users,
                           connected_users=len(connected_users))


@SOCKET_IO.on("message")
def handle_messages(data):
    username = data["username"]
    message = data["message"]
    chat = Chat(username=username, message=message)
    DB.session.add(chat)
    DB.session.commit()
    emit("receive", data, broadcast=True)


@SOCKET_IO.on("disconnect")
def handle_disconnect():
    disconnected_user = session["username"]
    connected_users.remove(disconnected_user)
    emit("connection_state", {
        "event": "disconnect",
        "username": disconnected_user,
        "connected_users": len(connected_users)
    },
         broadcast=True)


@SOCKET_IO.on("connection")
def handle_connect():
    username = session["username"]
    emit("connection_details", {"username": username})
    emit("connection_state", {
        "event": "connect",
        "username": username,
        "connected_users": len(connected_users)
    },
         broadcast=True)
