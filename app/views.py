from flask import Blueprint, render_template, redirect, url_for, session
from .form import EnterForm
from . import SOCKET_IO
from flask_socketio import emit
from flask import flash

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
    print(data)
    emit("receive", data, broadcast=True)


@SOCKET_IO.on("disconnection")
def handle_disconnect():
    print("disconnection happen")


@SOCKET_IO.on("connection")
def handle_connect():
    username = session["username"]
    emit("connection_details", {"username": username})
    emit("connection_state", {
        "username": username,
        "connected_users": len(connected_users)
    },
         broadcast=True)
