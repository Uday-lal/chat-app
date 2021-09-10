from app import start_app
from app import APP

app = start_app()

if __name__ == "__main__":
    app.run(APP, debug=True)
