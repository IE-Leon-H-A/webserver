import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {SharedService} from '../_services/shared.service';


@Component({
  selector: 'app-charging',
  templateUrl: './charging.component.html'
})
export class ChargingComponent implements OnInit {

  // Are changed based on user input from pevious page
  charging_power = this.sharedService.power.power;
  soc = 0;
  money_spent = 0;
  money_left = 0;
  time_remaining_sec = 0;
  time_remaining_min = 0;

  constructor(
    private dialogRef: MatDialog,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.dialogRef.closeAll();
  }

  ngOnInit(): void {
    this.populateReceivedTelemetry();
    setTimeout(() => {
      this.requestChargingTelemetry()
    }, 2000);
    this.chargingStop();
  }

  requestChargingStop() {
    console.log("charging_stop_req");
    this.sharedService.sock.emit("charging_stop_req");
  }

  chargingStop() {
    this.sharedService.sock.on('charging_stop_resp', (stop_confirm: any) => {
      console.log("charging_stop_resp (bool): " + stop_confirm);
      if (stop_confirm) {
        this.router.navigateByUrl("/summary");
      } else {
        console.log("backed did not succeed to stop charging");
      }
    })
  }

  populateReceivedTelemetry() {
    this.sharedService.sock.on('charge_session_telemetry_resp', (message: any) => {
      console.log("charge_session_telemetry_resp")
      let telemetry = JSON.parse(message);
      console.log(message);

      if (telemetry["charging_active"] === 1) {
        this.sharedService.ev_soc = this.soc = telemetry["soc"];
        this.sharedService.cash_spent = this.money_spent = telemetry["money_spent"];
        this.money_left = telemetry["money_left"];
        this.charging_power = telemetry["charging_power"];
        this.time_remaining_min = Math.floor(telemetry["time_remaining_sec"] / 60);
        this.time_remaining_sec = telemetry["time_remaining_sec"] % 60;
        this.sharedService.energy_transfered = telemetry["transfered_energy"]
      } else {
        this.router.navigateByUrl("/home");
      }
    })
  }

  requestChargingTelemetry() {
    setTimeout(() => {
      this.sharedService.sock.emit("charge_session_telemetry_req");
      console.log("charge_session_telemetry_req")
      if (this.router.url === "/charging") {
        this.requestChargingTelemetry();
      }
    }, 250)
  }
}
