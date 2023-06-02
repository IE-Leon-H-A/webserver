import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-charging',
  templateUrl: './charging.component.html',
  styleUrls: ['./charging.component.scss']
})
export class ChargingComponent implements OnInit {

  constructor(private dialogRef: MatDialog) {

    this.dialogRef.closeAll();
  }

  ngOnInit(): void {
    this.mockCharging();
  }

  mockCharging(){
    // Exit flag
    var charging_active_flag = 1;

    // Are changed based on user input from pevious page
    var price = 1;
    var price_limit = 1;
    var charging_power = 200;

    // Hadcoded
    var start_time = new Date().getTime() / 1000;;
    var ev_capacity = 50;
    var ev_start_soc = 46;

    // func vars
    var elapsed_time = 0;
    var trasnfered_kwh = 0;
    var soc = 0;
    var money_spent = 0;
    var money_left = 0;
    var time_remaining = 0;

    var approx_energy = price_limit / price;
    // console.log("approx energy: " + String(approx_energy) + " kWh");

    var approx_time = (approx_energy / charging_power) * 3600;
    // console.log("approx time: " + String(approx_time) + " sec");

    function myLoop() {

      setTimeout(function() {

        elapsed_time = new Date().getTime() / 1000 - start_time;
        // console.log("elapsed time: " + elapsed_time);

        trasnfered_kwh = (charging_power * elapsed_time) / 3600;
        // console.log("transfered energy kwh: " + trasnfered_kwh);

        soc = (trasnfered_kwh / ev_capacity) * 100 + ev_start_soc;
        // console.log("soc: " + soc);

        money_spent = trasnfered_kwh / price;
        // console.log("money spent: " + money_spent);

        money_left = price_limit - money_spent;
        // console.log("money spent: " + money_left);

        if (money_spent > (price_limit - 0.05)) {
          console.log("cost limit reached");
          charging_active_flag = 0;
          // Redirect
        }

        time_remaining = approx_time - elapsed_time
        console.log("time remaining: " + time_remaining);

        if (charging_active_flag === 1) {
          myLoop();
        }
      }, 250)
    }
    
    myLoop();  

  }


}
