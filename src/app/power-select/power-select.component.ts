import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-power-select',
  templateUrl: './power-select.component.html'
})
export class PowerSelectComponent implements OnInit {

  powers = [
    {
      power: 50,
      price: '0,80'
    },
    {
      power: 100,
      price: '0,82'
    },
    {
      power: 150,
      price: '0,85'
    },
    {
      power: 200,
      price: '0,90'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
