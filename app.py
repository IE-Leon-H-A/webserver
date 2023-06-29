import os
from flask import Flask, send_from_directory, request
from flask import render_template
from flask_socketio import SocketIO
import json
from time import sleep

# app = Flask(__name__)
app = Flask(__name__, static_folder="dist/punionica", static_url_path="/")
app.config["SECRET_KEY"] = "asdf"
socketio = SocketIO(app)

background_task = 0


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")


@socketio.on("requested_charging_power")
def requested_charging_power(message):
    # todo: shared memory write
    print(message)


@socketio.on("requested_price_limit")
def requested_price_limit(message):
    # todo: shared memory write
    print(message)


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

    d0 = dict(
      estop=0,
      secc="secc_state",
      evse=5,
      redirect_request="redirect_request",
    )

    d1 = dict(
        estop=1,
        secc="secc_state",
        evse=5,
        redirect_request="redirect_request",
    )

    d2 = dict(
        estop=0,
        secc="secc_state",
        evse=5,
        redirect_request="redirect_request",
    )

    d3 = dict(
        estop=0,
        secc="secc_state",
        evse=0,
        redirect_request="redirect_request",
    )

    while True:
        # estop_state = gpio.e_stop_status()
        # secc_state = secc_reader.advanticsControllerStatus()
        # evse_state = evse_reader.get_evse_state()[1]
        # redirect_request = evse_reader.get_redirect_request()

        # socketio.emit(
        #   "status_update",
        #   json.dumps(d0),
        # )
        # sleep(3)
        #
        # socketio.emit(
        #     "status_update",
        #     json.dumps(d1),
        # )
        # sleep(3)
        #
        # socketio.emit(
        #     "status_update",
        #     json.dumps(d2),
        # )
        # sleep(3)
        #
        # socketio.emit(
        #     "status_update",
        #     json.dumps(d3),
        # )
        sleep(3)


if __name__ == "__main__":
    # app.run(host="0.0.0.0", debug=False)
    socketio.run(app=app, debug=True, host="0.0.0.0", allow_unsafe_werkzeug=True)
