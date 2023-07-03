import time
from time import sleep
from flask import Flask
from flask_socketio import SocketIO

from punionica.modules.evse import EVSEReader, EVSEWriter
from punionica.modules.gpio import ControlGPIO
from punionica.modules.bp25 import BP25Reader, BP25Writer
from punionica.modules.secc import SECCReader, SECCWriter
from punionica.modules.lb1024 import LB1024Reader, LB1024Writer
from punionica.modules.bms import BmsReader, BmsWriter
from punionica.statemachines.module_packet_definition import ModulesPacket

from punionica.webserver import logger

modules = ModulesPacket(
    secc_reader=SECCReader(),
    secc_writer=SECCWriter(),
    bp25_reader=BP25Reader(),
    bp25_writer=BP25Writer(),
    lb1024_reader=LB1024Reader(),
    lb1024_writer=LB1024Writer(),
    gpio=ControlGPIO(),
    evse_reader=EVSEReader(),
    evse_writer=EVSEWriter(),
    bms_reader=BmsReader(),
    bms_writer=BmsWriter(),
)
modules.create_connections()


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
    modules.evse_writer.user_requested_charging_power(power=message["power"])
    # sleep(0.5)
    # modules.evse_reader.user_requested_charging_power(show_on_console=True)


@socketio.on("requested_price_limit")
def requested_price_limit(message):
    modules.evse_writer.charge_session_cost_limit(limit=message["price_limit"])
    # sleep(0.5)
    # modules.evse_reader.charge_session_cost_limit(show_on_console=True)


@socketio.on("card_tap_confirmation")
def card_tap_confirmation():
    # todo: televend ping-pong
    sleep(1)
    socketio.emit("card_tap_confirmation", 1)


@socketio.on("payment_processing")
def payment_processing():
    # todo: televend ping-pong
    sleep(1)
    socketio.emit("payment_processing", 1)


@socketio.on("vehicle_plugin_status")
def vehicle_plugin_status():
    # All values are expressed in ms as modules parsers expand time from seconds to miliseconds [time.time() * 1000]
    timeout_start = time.time() * 1000
    timeout_limit = 15000  # Timeout limit of 15 seconds

    while True:
        sleep(0.5)
        if (timeout_counter := time.time() * 1000 - timeout_start) > timeout_limit:
            logger.error(
                f"EVSE did not transition to state 'Charging' for {timeout_counter / 1000} sec"
            )
        if state := modules.evse_reader.evse_state() != 4:
            logger.debug(f"EVSE not in 'Charge' state, EVSE in state: {state}")
            continue

        else:
            logger.debug("EVSE in state 'Charge'")
            socketio.emit("vehicle_plugin_status", 1)


@socketio.on("start_background_checks")
def status_change():
    global background_task
    if background_task != 1:
        print("starting background checks")
        socketio.start_background_task(background_checks())
    else:
        print("background checks already running")


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
    try:
        # app.run(host="0.0.0.0", debug=False)
        socketio.run(app=app, debug=True, host="0.0.0.0", allow_unsafe_werkzeug=True)

    except Exception as err:
        logger.error(err)

    finally:
        modules.destroy_objects()
