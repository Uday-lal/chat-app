from werkzeug import debug
from website import start_app
from website import APP

app = start_app()

if __name__ == "__main__":
    APP.run()
