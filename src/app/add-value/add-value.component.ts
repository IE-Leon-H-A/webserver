import { Component, OnInit } from '@angular/core';

import { SharedService } from './../_services/shared.service';

@Component({
  selector: 'app-add-value',
  templateUrl: './add-value.component.html',
})
export class AddValueComponent implements OnInit {

  keyboardButtons = [
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
    { value: '5' },
    { value: '6' },
    { value: '7' },
    { value: '8' },
    { value: '9' },
    { value: '00' },
    { value: '0' },
    { value: 'backspace' }
  ];

  constructor(
    public sharedService: SharedService
  ) {
    sharedService.priceLimit = '0';
    sharedService.calculatedKwh = 0;
  }

  ngOnInit(): void {
  }

  numPadPressed(key: any) {
    if (key === 'backspace') {
      if (this.sharedService.priceLimit.length === 1) {
        this.sharedService.priceLimit = '0';
      } else {
        this.sharedService.priceLimit = this.sharedService.priceLimit.slice(0, -1);
      }
    } else if (this.sharedService.priceLimit.length < 4) {
      if (this.sharedService.priceLimit === '0') {
        this.sharedService.priceLimit = key;
      } else {
        this.sharedService.priceLimit = this.sharedService.priceLimit + key;
      }
    }
    this.calclulateKwh()
  }


  calclulateKwh() {
    this.sharedService.calculatedKwh = Number(this.sharedService.priceLimit) / this.sharedService.power.price
  }


}
