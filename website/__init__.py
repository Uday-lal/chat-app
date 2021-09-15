import os
import secrets
from flask import Flask, url_for
from flask_socketio import SocketIO

APP = Flask(__name__)
SOCKET_IO = SocketIO(APP)


def start_app():
    from .views import views
    APP.config["SECRET_KEY"] = secrets.token_hex(28)
    APP.register_blueprint(views)
    return SOCKET_IO
