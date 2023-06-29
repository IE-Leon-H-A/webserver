import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { SharedService } from '../_services/shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @ViewChild('serviceUnavailable') serviceUnavailable: ElementRef | undefined;
  @ViewChild('eStopActive') eStopActive: ElementRef | undefined;

  // sock = io();

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private sharedService: SharedService,
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
    this.sharedService.sock.emit("start_background_checks");
    console.log("requested continuous background evse status checks");
  }

  // sendMessage(message: any) {
  //   this.sock.emit('request', message);
  // }

  // getNewMessage = () => {
  //   this.sock.on('response', (message: any) => {
  //     console.log(message);
  //   })
  // }

  getBackgroundStatus = () => {
    let estop_state = 0;
    let evse_state = 0;
    let secc_state = 0;

    this.sharedService.sock.on('status_update', (message: any) => {
      console.log(message);
      let update = JSON.parse(message);

      if (update["estop"] != estop_state){
        // state changed
        if (update["estop"] === 0 && estop_state === 0) {
          // Estop not active, modal not active -> pass
        }
        else if (update["estop"] === 1 && estop_state === 0) {
          // Estop active, modal not active
          this.openDialog(this.eStopActive);
        }
        else if (update["estop"] === 1 && estop_state === 1) {
          // Estop active, modal active -> pass
        }
        else if (update["estop"] === 0 && estop_state === 1) {
          // Estop not active, modal active
          this.dialog.closeAll();
          this.router.navigateByUrl("/home");
        }
        else {
          console.log("unknown estop state")
        }
        // update state
        estop_state = update["estop"];
      }

      else if (update["evse"] != evse_state){
        // state changed
        if (update["evse"] === 0 && evse_state === 0) {
          // evse not booted, modal is active -> pass
        }
        else if (update["evse"] === 0 && evse_state !== 0) {
          // evse not booted, modal not active
          this.openDialog(this.serviceUnavailable);
        }
        else if (update["evse"] !== 0 && evse_state !== 0) {
          // evse booted, modal not active -> pass
        }
        else if (update["evse"] !== 0 && evse_state === 0) {
          // evse booted, modal still active
          this.dialog.closeAll();
          this.router.navigateByUrl("/home");
        }
        else {
          console.log("unknown evse state");
        }
        // update state
        evse_state = update["evse"];
      }
    })
  }
}
