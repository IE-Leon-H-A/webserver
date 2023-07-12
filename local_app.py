import json
import time
from time import sleep
from flask import Flask, render_template
from flask_socketio import SocketIO

# from punionica.modules.evse import EVSEReader, EVSEWriter
# from punionica.modules.gpio import ControlGPIO
# from punionica.modules.bp25 import BP25Reader, BP25Writer
# from punionica.modules.secc import SECCReader, SECCWriter
# from punionica.modules.lb1024 import LB1024Reader, LB1024Writer
# from punionica.modules.bms import BmsReader, BmsWriter
# from punionica.statemachines.module_packet_definition import ModulesPacket
#
# from punionica.webserver import logger
#
# modules = ModulesPacket(
#     secc_reader=SECCReader(),
#     secc_writer=SECCWriter(),
#     bp25_reader=BP25Reader(),
#     bp25_writer=BP25Writer(),
#     lb1024_reader=LB1024Reader(),
#     lb1024_writer=LB1024Writer(),
#     gpio=ControlGPIO(),
#     evse_reader=EVSEReader(),
#     evse_writer=EVSEWriter(),
#     bms_reader=BmsReader(),
#     bms_writer=BmsWriter(),
# )
# modules.create_connections()


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
    asdf = dict()
    asdf[1] = 3246
    asdf[3] = 3248
    asdf[4] = 3217
    socketio.emit("battery_response", json.dumps(
      asdf
    ))
    # data_dict = dict()
    # for i, cell in enumerate(modules.bms_reader.addresses_reference.keys()):
    #     if i + 1 <= 366:
    #         value = modules.bms_reader.read_memory(
    #             address=cell, field_has_timestamp=False
    #         ).value
    #         data_dict[i + 1] = int().from_bytes(value, byteorder="big", signed=True)
    #     else:
    #         pass
    # socketio.emit("battery_data_response", json.dumps(data_dict))


@socketio.on("requested_charging_power")
def requested_charging_power(message):
    pass
    # ! temporary for testing without batteries
    # modules.evse_writer.user_requested_charging_power(power=10)
    # modules.evse_writer.user_requested_charging_power(power=message["power"])

    # DEBUGGING
    # sleep(0.5)
    # modules.evse_reader.user_requested_charging_power(show_on_console=True)


@socketio.on("requested_cash_limit")
def requested_price_limit(message):
    pass
    # modules.evse_writer.charge_session_cost_limit(limit=message["price_limit"])

    # DEBUGGING
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
    sleep(1)
    socketio.emit("vehicle_plugin_status", 1)
    # while True:
    #     secc_state = modules.secc_reader.advanticsControllerStatus().data
    #     if secc_state != 4:
    #         logger.debug(f"SECC in state [{secc_state}] waiting for state 'Charge'")
    #         sleep(0.5)
    #     else:
    #         socketio.emit("vehicle_plugin_status", 1)
    #         break


@socketio.on("charge_session_telemetry_request")
def charge_session_telemetry():
    pass
    # charging_active = modules.evse_reader.charging_active_flag().data
    # soc = modules.secc_reader.chargingLoop().data["stateOfCharge"]
    # money_spent = modules.evse_reader.charge_session_spent_cash().data
    # money_left = modules.evse_reader.charge_session_remaining_cash().data
    # charging_power = modules.evse_reader.present_charging_power().data
    # time_remaining_sec = modules.evse_reader.charge_session_time_remaining().data
    #
    socketio.emit(
        "charge_session_telemetry",
        json.dumps(
            dict(
                charging_active=1,
                soc=76,
                money_spent=24.68,
                money_left=0.32,
                charging_power=187,
                time_remaining_sec=23,
            )
        ),
    )


@socketio.on("charging_stop")
def charging_stop():
    # modules.secc_writer.sequenceControl(control_mode=65536)
    # # todo: emit shall be based on secc status check
    socketio.emit("charging_stop", 1)


@socketio.on("evse_status_req")
def status_change():
    global background_task
    if background_task != 1:
        print("starting background status checks")
        socketio.start_background_task(background_checks())
    else:
        print("background status checks already running")


def background_checks():
    global background_task
    background_task = 1

    # d0 = dict(
    #     estop=0,
    #     secc="secc_state",
    #     evse=5,
    #     redirect_request="redirect_request",
    # )
    #
    # d1 = dict(
    #     estop=1,
    #     secc="secc_state",
    #     evse=5,
    #     redirect_request="redirect_request",
    # )
    #
    # d2 = dict(
    #     estop=0,
    #     secc="secc_state",
    #     evse=5,
    #     redirect_request="redirect_request",
    # )
    #
    # d3 = dict(
    #     estop=0,
    #     secc="secc_state",
    #     evse=0,
    #     redirect_request="redirect_request",
    # )

    while True:
        pass
        # estop_state = modules.gpio.e_stop_status()
        # evse_state = modules.evse_reader.evse_state().data
        # secc_state = modules.secc_reader.advanticsControllerStatus().data
        #
        # todo:
        # redirect_request = modules.evse_reader.get_redirect_request().data
        #
        # print(estop_state)
        # print(evse_state)
        #
        # socketio.emit(
        #     "evse_status_resp",
        #     json.dumps(dict(estop=int(estop_state), evse=int(evse_state))),
        # )

        sleep(0.5)


if __name__ == "__main__":
    try:
        # app.run(host="0.0.0.0", debug=False)
        socketio.run(app=app, debug=False, host="0.0.0.0", allow_unsafe_werkzeug=True)
        # socketio.run(app=app, debug=True, host="0.0.0.0", allow_unsafe_werkzeug=True)

    except Exception as err:
        pass
        # logger.error(err)

    finally:
        pass
        # modules.destroy_objects()
