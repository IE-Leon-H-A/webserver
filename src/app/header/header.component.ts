import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {io} from "socket.io-client";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @ViewChild('serviceUnavailable') serviceUnavailable: ElementRef | undefined;
  @ViewChild('eStopActive') eStopActive: ElementRef | undefined;

  sock = io();

  constructor(
    public router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.startBackgroundChecks();
    this.getBackgroundStatus();
  }

  goBack() {
    if (this.router.url === '/power-select') {
      this.router.navigateByUrl('/home');
    }

    if (this.router.url === '/add-value') {
      this.router.navigateByUrl('/power-select');
    }

    if (this.router.url === '/payment') {
      this.router.navigateByUrl('/power-select');
    }

    if (this.router.url === '/payment') {
      this.router.navigateByUrl('/home');
    }

    if (this.router.url === '/charging') {
      this.router.navigateByUrl('/home');
    }
  }

  openDialog(dialogName: any) {
    this.dialog.open(dialogName, {
      width: '1142px',
      height: '686px',
      disableClose: true
    });

  }

  closeDialog(dialogName: any) {
    this.dialog.closeAll();
  }

  startBackgroundChecks(): void {
    this.sock.emit("start_background_checks");
    console.log("sent bg check request");
  }

  // sendMessage(message: any) {
  //   this.sock.emit('request', message);
  // }

  getNewMessage = () => {
    this.sock.on('response', (message: any) => {
      console.log(message);
    })
  }

  getBackgroundStatus = () => {
    let estop_state = 0;
    let evse_state = 0;
    let secc_state = 0;

    this.sock.on('status_update', (message: any) => {
      console.log(message);
      let update = JSON.parse(message);

      if (update["estop"] === 1) {
        // estop active
        if (estop_state != update["secc"]) {
          estop_state = 1;
          this.openDialog(this.eStopActive);
          console.log("opened modal")
        } else {
          // pass, eastop is active and modal is visible
        }
      } else if (update["estop"] === 0) {
        if (estop_state != update["secc"]) {
          estop_state = 0;
          // estop condition disappeared, hide modal and redirect
          this.dialog.closeAll();
          this.router.navigateByUrl("/home");
        } else {
          // pass, estop is not active and modal is not visible
        }
      }

      if (evse_state === 0) {
        if (update["evse"] === 0) {
          if (evse_state != update["evse"]) {
            evse_state = 0;
            this.dialog.closeAll();
            this.openDialog(this.serviceUnavailable);
          } else {
            evse_state = update["evse"];
            this.dialog.closeAll();
          }
        } else if (update["secc"] === 12) {
          if (secc_state != update["evse"]) {
            secc_state = update["secc"];
            this.dialog.closeAll();
            this.openDialog(this.serviceUnavailable);
          } else {
            evse_state = update["secc"];
            this.dialog.closeAll();
          }
        } else {
          console.log("No action or Unknown data");
        }
      }
    })
  }
}
