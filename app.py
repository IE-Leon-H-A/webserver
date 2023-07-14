import json
import time
from time import sleep
from flask import Flask, render_template
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


@app.route("/battery", defaults={"path": ""})
@app.route("/<path:path>")
def battery(path):
    return app.send_static_file("index.html")


@socketio.on("battery_request")
def data_request():
    data_dict = dict()
    for i, cell in enumerate(modules.bms_reader.addresses_reference.keys()):
        if i + 1 <= 366:
            value = modules.bms_reader.read_memory(
                address=cell, field_has_timestamp=False
            ).value
            data_dict[i + 1] = int().from_bytes(value, byteorder="big", signed=True)
        else:
            pass
    socketio.emit("battery_response", json.dumps(data_dict))


@socketio.on("requested_charging_power")
def requested_charging_power(charging_power):
    # ! temporary for testing without batteries
    modules.evse_writer.user_requested_charging_power(power=10)
    # modules.evse_writer.user_requested_charging_power(power=charging_power)

    # DEBUGGING
    # sleep(0.5)
    # modules.evse_reader.user_requested_charging_power(show_on_console=True)


@socketio.on("requested_cash_limit")
def requested_price_limit(cash_limit):
    modules.evse_writer.charge_session_cost_limit(limit=cash_limit)

    # DEBUGGING
    # sleep(0.5)
    # modules.evse_reader.charge_session_cost_limit(show_on_console=True)


@socketio.on("card_tap_confirmation_req")
def card_tap_confirmation():
    # todo: televend ping-pong
    sleep(1)
    socketio.emit("card_tap_confirmation_resp", 1)


@socketio.on("payment_processing_req")
def payment_processing():
    # todo: televend ping-pong
    sleep(1)
    socketio.emit("payment_processing_resp", 1)


@socketio.on("vehicle_plugin_req")
def vehicle_plugin_status():
    while True:
        secc_state = modules.secc_reader.advanticsControllerStatus().data
        if secc_state != 4:
            logger.debug(f"SECC in state [{secc_state}] waiting for state 'Charge'")
            sleep(0.5)
        else:
            socketio.emit("vehicle_plugin_resp", 1)
            break


@socketio.on("charge_session_telemetry_req")
def charge_session_telemetry():
    soc = modules.secc_reader.chargingLoop().data["stateOfCharge"]
    money_spent = modules.evse_reader.charge_session_spent_cash().data
    money_left = modules.evse_reader.charge_session_remaining_cash().data
    charging_power = modules.evse_reader.present_charging_power().data
    time_remaining_sec = modules.evse_reader.charge_session_time_remaining().data

    socketio.emit(
        "charge_session_telemetry_resp",
        json.dumps(
            dict(
                charging_active=1,
                soc=soc,
                money_spent=money_spent,
                money_left=money_left,
                charging_power=charging_power,
                time_remaining_sec=time_remaining_sec,
            )
        ),
    )


@socketio.on("charging_stop_req")
def charging_stop():
    modules.secc_writer.sequenceControl(control_mode=65536)
    # todo: emit shall be based on secc status check
    socketio.emit("charging_stop_resp", 1)


@socketio.on("evse_status_req")
def status_change():
    global background_task
    if background_task != 1:
        print("evse_status loop [start]")
        socketio.start_background_task(background_checks())
    else:
        print("evse_status loop [running]")


def background_checks():
    global background_task
    background_task = 1

    while True:
        estop_state = modules.gpio.e_stop_status()
        evse_state = modules.evse_reader.evse_state().data
        secc_state = modules.secc_reader.advanticsControllerStatus().data

        socketio.emit(
            "evse_status_resp",
            json.dumps(dict(estop=int(estop_state), evse=int(evse_state))),
        )

        sleep(0.5)


if __name__ == "__main__":
    try:
        # app.run(host="0.0.0.0", debug=False)
        socketio.run(app=app, debug=False, host="0.0.0.0", allow_unsafe_werkzeug=True)

    except Exception as err:
        logger.error(err)

    finally:
        modules.destroy_objects()
