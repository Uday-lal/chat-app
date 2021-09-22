from website import start_app

socket_io, app = start_app()

if __name__ == "__main__":
    socket_io.run(app=app, debug=True)
