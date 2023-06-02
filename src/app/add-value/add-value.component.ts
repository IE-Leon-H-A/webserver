import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-value',
  templateUrl: './add-value.component.html',
})
export class AddValueComponent implements OnInit {

  power = {
    power: 50,
    price: 0.82
  };

  priceLimit = '0';

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
  ]

  calculatedKwh = 0;

  constructor() { }

  ngOnInit(): void {
  }

  numPadPressed(key: any) {
    if (key === 'backspace') {
      if (this.priceLimit.length === 1) {
        this.priceLimit = '0';
      } else {
        this.priceLimit = this.priceLimit.slice(0, -1);
      }
    } else if (this.priceLimit.length < 5) {
      if (this.priceLimit === '0') {
        this.priceLimit = key;
      } else {
        this.priceLimit = this.priceLimit + key;
      }
    }
    this.calclulateKwh()
  }


  calclulateKwh() {
    this.calculatedKwh = Number(this.priceLimit) * this.power.price
  }


}
