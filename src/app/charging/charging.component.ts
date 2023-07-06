import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {SharedService} from '../_services/shared.service';
import {jsDocComment} from "@angular/compiler";


@Component({
  selector: 'app-charging',
  templateUrl: './charging.component.html'
})
export class ChargingComponent implements OnInit {

  // Exit flag
  // charging_active_flag = 1;

  // Are changed based on user input from pevious page
  price = this.sharedService.power.price;
  price_limit = Number(this.sharedService.priceLimit);
  charging_power = this.sharedService.power.power;

  // // Hadcoded
  // start_time = new Date().getTime() / 1000;
  // ev_capacity = 40;
  // ev_start_soc = this.randomInteger(30, 50);

  // func vars
  // elapsed_time = 0;
  // trasnfered_kwh = 0;
  soc = 0;
  money_spent = 0;
  money_left = 0;
  time_remaining_sec = 0;
  time_remaining_min = 0;

  approx_energy = this.price_limit / this.price;
  // console.log("approx energy: " + String(approx_energy) + " kWh");
  // approx_time = (this.approx_energy / this.charging_power) * 3600;
  // console.log("approx time: " + String(approx_time) + " sec");


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

  randomInteger(min: any, max: any) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  requestChargingStop() {
    this.sharedService.sock.emit("charging_stop");
  }

  chargingStop() {
    this.sharedService.sock.on('charging_stop', (stop_confirm: any) => {
      console.log("card_tap_confirmation (bool): " + stop_confirm);
      if (stop_confirm) {
        this.router.navigateByUrl("/home");
      } else {
        console.log("backed did not succeed to stop charging");
      }
    })
  }

  populateReceivedTelemetry() {
    this.sharedService.sock.on('charge_session_telemetry', (message: any) => {
      let telemetry = JSON.parse(message);
      console.log(message);

      if (telemetry["charging_active"] === 1) {
        this.soc = telemetry["soc"];
        this.money_spent = telemetry["money_spent"];
        this.money_left = telemetry["money_left"];
        this.charging_power = telemetry["charging_power"];
        this.time_remaining_min = telemetry["time_remaining_min"];
      } else {
        this.router.navigateByUrl("/home");
      }


    })

  }

  requestChargingTelemetry() {

    setTimeout(() => {
      this.sharedService.sock.emit("charge_session_telemetry_request");

      if (this.router.url === "/charging") {
        this.requestChargingTelemetry();
      }
    }, 250)
  }
}
