import os
from flask import Flask, send_from_directory, request
from flask import render_template
from flask_socketio import SocketIO
import json
from time import sleep

# app = Flask(__name__)
app = Flask(__name__, static_folder='dist/punionica', static_url_path="/")
app.config["SECRET_KEY"] = "asdf"
socketio = SocketIO(app)

background_task = 0


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file("index.html")


# @socketio.on("request")
# def default_endpoint(message):
#     print(message)
#     socketio.emit("response", "hello client")


@socketio.on("start_background_checks")
def status_change():
    global background_task
    if background_task != 1:
        print("starting background checks")
        socketio.start_background_task(background_checks())
    else:
        print("bg checks already running")


def background_checks():
    global background_task
    background_task = 1

    dev_cntr = 0

    while True:
        # estop_state = gpio.e_stop_status()
        # secc_state = secc_reader.advanticsControllerStatus()
        # evse_state = evse_reader.get_evse_state()[1]
        # redirect_request = evse_reader.get_redirect_request()

        if dev_cntr % 2 == 0:
            estop = 1
            evse = 5
        else:
            estop = 0
            evse = 0

        # estop = 1
        # evse = 5

        socketio.emit(
            "status_update",
            json.dumps(
                dict(
                    estop=estop,
                    secc="secc_state",
                    evse=evse,
                    redirect_request="redirect_request",
                )
            ),
        )
        # sleep(0.25)
        dev_cntr += 1
        sleep(3)


if __name__ == "__main__":
    # app.run(host="0.0.0.0", debug=False)
    socketio.run(app=app, debug=True, host="0.0.0.0", allow_unsafe_werkzeug=True)
