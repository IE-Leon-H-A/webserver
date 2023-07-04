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
    this.sharedService.sock.on("card_tap_confirmation", (cardTapSuccessful: boolean) => {
      console.log("card_tap_confirmation (bool): " + cardTapSuccessful);

      if (cardTapSuccessful) {
        this.paymentProcessing();
      }
      else {
        // todo: add modal to inform user about timeout and that the funds will be returned
        this.router.navigateByUrl("/home");
      }
    });

    this.sharedService.sock.emit("card_tap_confirmation");
  }

  paymentProcessing() {
    this.processingPayment = true;
    this.infoText = 'Processing payment';

    this.sharedService.sock.on("payment_processing", (paymentProcessSuccessful: boolean) => {
      console.log("payment_processing (bool): " + paymentProcessSuccessful);

      if (paymentProcessSuccessful) {
        this.paymentSuccess();
      }
      else {
        // todo: add modal to inform user about timeout and that the funds will be returned
        this.router.navigateByUrl("/home");
      }
    });

    this.sharedService.sock.emit("payment_processing");
  }

  paymentSuccess() {
    this.infoText = 'Payment Succesful';

    setTimeout(() => {
      this.vehiclePlugIn();
    }, 5000);
  }

  vehiclePlugIn() {
    this.sharedService.sock.on("vehicle_plugin_status", (pluginSuccessful: any) => {
      console.log("payment_processing (bool): " + pluginSuccessful);

      if (pluginSuccessful === 1) {
        this.router.navigateByUrl('/charging');
      } else {
        // Funds return is done by the backend after it emits this socketio message
        // todo: add modal to inform user about timeout and that the funds will be returned
        this.router.navigateByUrl('/home');
      }
    });

    this.sharedService.sock.emit("vehicle_plugin_status");

    // Timeout is done in the backend
    this.openDialog(this.startToCharge);
  }

  openDialog(dialogName: any) {
    this.dialog.open(dialogName, {
      width: '1142px',
      height: '686px',
    });
  }

}
