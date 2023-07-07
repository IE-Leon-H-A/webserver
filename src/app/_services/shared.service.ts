import { Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import {io} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  sock = io();

  ev_soc = 0;
  cash_spent = 0;
  cash_left = 0;
  charging_power = 0;
  time_remaining = 0;
  energy_transfered = 0;

  power = {
    power: 50,
    price: 0.82
  };

  priceLimit = '0';
  calculatedKwh = 0;

  constructor(
    private router: Router
  ) { }

  goToUrl(urls: string | UrlTree) {
    this.router.navigateByUrl(urls);
  }

}
