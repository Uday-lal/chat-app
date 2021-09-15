import os
import secrets
from flask import Flask, url_for
from flask_socketio import SocketIO

APP = Flask(__name__)
SOCKET_IO = SocketIO(APP)


@APP.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(APP.root_path, endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


def start_app():
    from .views import views
    APP.config["SECRET_KEY"] = secrets.token_hex(28)
    APP.register_blueprint(views)
    return SOCKET_IO
