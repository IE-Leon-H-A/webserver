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


@app.route("/battery")
def battery():
    return render_template("battery_cabinet.html")


@socketio.on("battery_data_request")
def data_request():
    data_dict = dict()
    for i, cell in enumerate(modules.bms_reader.addresses_reference.keys()):
        if i + 1 <= 366:
            value = modules.bms_reader.read_memory(address=cell, field_has_timestamp=False).value
            data_dict[i + 1] = int().from_bytes(value, byteorder="big", signed=True)
        else:
            pass
    socketio.emit('battery_data_response', json.dumps(
        data_dict
    ))


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
    while modules.secc_reader.advanticsControllerStatus().data not in [2, 3, 4]:
        sleep(0.5)
    socketio.emit("vehicle_plugin_status", 1)


@socketio.on("charge_session_telemetry_request")
def charge_session_telemetry():
    # todo: add check and exit if price limit reached -> FE has open ws callback for charging stop
    # todo: add check and exit if SoC == 100%         -> FE has open ws callback for charging stop

    # todo: data required for all calcs:
    #   * charging start time             [system clock secs] - NOT DATE STRING
    #   * charging stop time              [system clock secs] - NOT DATE STRING
    #   * active charging power           [kW]
    #   * EV start SoC (chargeLoop)       [%]
    #   * EV present SoC (chargeLoop)     [%]
    #   * user price limit                [eur]

    # todo: required calcs based on colleted data:
    #   * elapsed time calc               [system clock secs] - NOT DATE STRING
    #   * transfered energy               [kWh]
    #   * money spent                     [eur]
    #   * money left                      [eur]
    #   * time remaining                  [sec] -> (include logic for power ramp-up/downs)

    socketio.emit("charge_session_telemetry",
                  json.dumps(
                      dict(
                          hello="world"
                      )
                  ))


@socketio.on("charging_stop")
def charging_stop():
    # todo: send secc message to request charge stop
    stop_confirm = True  # todo: based on secc status check

    if stop_confirm:
        socketio.emit("charging_stop", json.dumps(
          dict(
              charging_stopped="true"
          )
        ))
    else:
        # todo: implement timeout
        socketio.emit("charging_stop", json.dumps(
          dict(
            charging_stopped="false"
          )
        ))

    # while True:
    #     soc = secc_reader.chargingLoop(break_on_old_timestamp=False)["stateOfCharge"]
    #     session_energy_entries = evse_reader.get_charging_sess_entries()
    #
    #     # todo: implement riemann sum to approximate spent energy and total cost
    #
    #     socketio.emit(
    #         "charge_session_telemetry_response",
    #         json.dumps(dict(ev_soc=soc, session_energy_entries=session_energy_entries)),
    #     )
    #     sleep(1)


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
        socketio.run(app=app, debug=False, host="0.0.0.0", allow_unsafe_werkzeug=True)

    except Exception as err:
        logger.error(err)

    finally:
        modules.destroy_objects()
