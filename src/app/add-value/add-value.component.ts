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

  constructor() { }

  ngOnInit(): void {
  }

}
