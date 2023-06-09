import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-power-select',
  templateUrl: './power-select.component.html'
})
export class PowerSelectComponent implements OnInit {

  powers = [
    {
      power: 50,
      price: 0.80
    },
    {
      power: 100,
      price: 0.83
    },
    {
      power: 150,
      price: 0.87
    },
    {
      power: 200,
      price: 0.90
    }
  ];

  constructor(
    public sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToAddValue(power: any) {
    this.sharedService.power = power;
    console.log("requested_charging_power = " + String(power["power"]));
    this.sharedService.sock.emit("requested_charging_power", power["power"]);
    this.router.navigateByUrl('/add-value');
  }

}
