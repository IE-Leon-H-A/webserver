import { Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import {io} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  sock = io();

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
