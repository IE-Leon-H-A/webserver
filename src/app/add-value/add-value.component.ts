import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-value',
  templateUrl: './add-value.component.html',
})
export class AddValueComponent implements OnInit {

  power = {
    power: 50,
    price: 0.80
  };

  priceLimit = 0;

  keyboardButtons = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: '00' },
    { value: 0 },
    { value: 'backspace' }


  ]

  constructor() { }

  ngOnInit(): void {
  }

}
