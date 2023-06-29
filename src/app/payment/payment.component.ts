import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SharedService } from './../_services/shared.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {

  @ViewChild('plugIn') startToCharge: ElementRef | undefined;

  processingPayment = false;

  infoText = 'Processing payment';


  constructor(
    public sharedService: SharedService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.processingPayment = true;
      this.infoText = 'Processing payment';

      setTimeout(() => {
        this.infoText = 'Payment Succesful';

        setTimeout(() => {
          this.openDialog(this.startToCharge);

          setTimeout(() => {
            this.router.navigateByUrl('/charging');
          }, 5000);

        }, 2000);

      }, 2000);

    }, 3000);
  }

  ngOnDestroy() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  openDialog(dialogName: any) {
    this.dialog.open(dialogName, {
      width: '1142px',
      height: '686px',
    });

  }

}
