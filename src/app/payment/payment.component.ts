import { Component, OnInit } from '@angular/core';

import { SharedService } from './../_services/shared.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {

  processingPayment = false;

  infoText = 'Processing payment'

  constructor(
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.processingPayment = true;
      this.infoText = 'Processing payment';

      setTimeout(() => {
        this.infoText = 'Payment Succesful';
      }, 2000);


    }, 3000);
  }

}
