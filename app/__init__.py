import os
import secrets
from flask import Flask, url_for
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

APP = Flask(__name__)
DB_NAME = "chat.db"
DB = SQLAlchemy()
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


def create_database():
    """
    Create the database if not already exist.
    :params app: Application instance
    :return: None
    """
    from . import model
    if not os.path.exists("app/" + DB_NAME):
        with APP.app_context():
            DB.create_all()


def start_app():
    from .views import views
    APP.config["SECRET_KEY"] = secrets.token_hex(28)
    APP.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    DB.init_app(APP)
    create_database()
    APP.register_blueprint(views)
    return SOCKET_IO
