import { SharedService } from './../_services/shared.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-charging',
  templateUrl: './charging.component.html',
  styleUrls: ['./charging.component.scss']
})
export class ChargingComponent implements OnInit {

  // Exit flag
  charging_active_flag = 1;

  // Are changed based on user input from pevious page
  price = 1;
  price_limit = 1;
  charging_power = this.sharedService.power.power;

  // Hadcoded
  start_time = new Date().getTime() / 1000;;
  ev_capacity = 50;
  ev_start_soc = 46;

  // func vars
  elapsed_time = 0;
  soc = 0;
  trasnfered_kwh = 0;
  money_spent = 0;
  money_left = 0;
  time_remaining_sec = 0;
  time_remaining_min = 0;

  approx_energy = this.price_limit / this.price;
  // console.log("approx energy: " + String(approx_energy) + " kWh");

  approx_time = (this.approx_energy / this.charging_power) * 3600;
  // console.log("approx time: " + String(approx_time) + " sec");


  constructor(
    private dialogRef: MatDialog,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.dialogRef.closeAll();
  }

  ngOnInit(): void {
    this.myLoop()
  }

  myLoop() {

    setTimeout(() => {

      this.elapsed_time = new Date().getTime() / 1000 - this.start_time;
      // console.log("elapsed time: " + elapsed_time);

      this.trasnfered_kwh = (this.sharedService.power.power * this.elapsed_time) / 3600;
      // console.log("transfered energy kwh: " + trasnfered_kwh);

      this.soc = (this.trasnfered_kwh / this.ev_capacity) * 100 + this.ev_start_soc;
      // console.log("soc: " + soc);

      this.money_spent = this.trasnfered_kwh / this.price;
      // console.log("money spent: " + money_spent);

      this.money_left = this.price_limit - this.money_spent;
      // console.log("money spent: " + money_left);

      if (this.money_spent > (this.price_limit - 0.05)) {
        // console.log("cost limit reached");
        this.charging_active_flag = 0;
        // Redirect
      }

      this.time_remaining_sec = (this.approx_time - this.elapsed_time)
      console.log("time remaining: " + this.time_remaining_sec);

      this.time_remaining_min = Math.floor((this.time_remaining_sec / 60));
      console.log(this.time_remaining_min);

      if (this.charging_active_flag === 1) {
        this.myLoop();
      }
      else {
        this.router.navigateByUrl("/home");
      }
    }, 250)
  }




}
