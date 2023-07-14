import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {SharedService} from '../_services/shared.service';

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
  ) {
  }

  ngOnInit(): void {
    this.cardTapConfirmation();
  }

  cardTapConfirmation() {
    this.sharedService.sock.on("card_tap_confirmation_resp", (cardTapSuccessful: boolean) => {
      console.log("card_tap_confirmation_resp (bool): " + cardTapSuccessful);
      if (cardTapSuccessful) {
        this.paymentProcessing();
      } else {
        // todo: add modal to inform user about timeout and that the funds will be returned
        this.router.navigateByUrl("/home");
      }
    });
    console.log("card_tap_confirmation_req");
    this.sharedService.sock.emit("card_tap_confirmation_req");
  }

  paymentProcessing() {
    this.processingPayment = true;
    this.infoText = 'Processing payment';
    this.sharedService.sock.on("payment_processing_resp", (paymentProcessSuccessful: boolean) => {
      console.log("payment_processing_resp (bool): " + paymentProcessSuccessful);
      if (paymentProcessSuccessful) {
        this.paymentSuccess();
      } else {
        // todo: add modal to inform user about timeout and that the funds will be returned
        this.router.navigateByUrl("/home");
      }
    });
    console.log("payment_processing_req");
    this.sharedService.sock.emit("payment_processing_req");
  }

  paymentSuccess() {
    console.log("payment successful icon");
    this.infoText = 'Payment Succesful';
    setTimeout(() => {
      this.vehiclePlugIn();
    }, 5000);
  }

  vehiclePlugIn() {
    this.openDialog(this.startToCharge);
    this.sharedService.sock.on("vehicle_plugin_resp", (pluginSuccessful: any) => {
      console.log("vehiclePlugIn_resp (bool): " + pluginSuccessful);
      if (pluginSuccessful === 1) {
        this.dialog.closeAll();
        this.router.navigateByUrl('/charging');
      } else {
        // todo: add modal to inform user about timeout and that the funds will be returned
        this.router.navigateByUrl('/home');
      }
    });
    console.log("vehicle_plugin_req");
    this.sharedService.sock.emit("vehicle_plugin_req");
  }

  openDialog(dialogName: any) {
    this.dialog.open(dialogName, {
      width: '1142px',
      height: '686px',
    });
  }

}
