import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SharedService} from '../_services/shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @ViewChild('serviceUnavailable') serviceUnavailable: ElementRef | undefined;
  @ViewChild('eStopActive') eStopActive: ElementRef | undefined;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.evseStatusResponse();
    this.evseStatusRequest();
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

  evseStatusRequest(): void {
    this.sharedService.sock.emit("evse_status_req");
    console.log("requested continuous background status checks");
  }

  evseStatusResponse = () => {
    let estop_state = 0;
    let evse_state = -1;

    this.sharedService.sock.on('evse_status_resp', (message: any) => {
      console.log(message);
      let update = JSON.parse(message);

      if (update["estop"] === 0 && estop_state === 0) {
        // Estop not active, modal not active -> pass
      } else if (update["estop"] === 1 && estop_state === 0) {
        // Estop active, modal not active
        this.dialog.closeAll();
        this.router.navigateByUrl("/home");  // Open on home instead of in the middle of sequence
        this.openDialog(this.eStopActive);
      } else if (update["estop"] === 1 && estop_state === 1) {
        // Estop active, modal active -> pass
      } else if (update["estop"] === 0 && estop_state === 1) {
        // Estop not active, modal active
        this.dialog.closeAll();
        evse_state = -1;
      } else {
        console.log("unknown estop state")
      }
      estop_state = update["estop"];

      if (update["estop"] === 0) {

        if (evse_state === -1) {
          // initial boot, evse not booted, modal is not active
          this.openDialog(this.serviceUnavailable);
        } else if (update["evse"] === 0 && evse_state === 0) {
          // evse not booted, modal is active -> pass
        } else if (update["evse"] === 0 && evse_state !== 0) {
          // evse not booted, modal not active
          this.dialog.closeAll();
          this.openDialog(this.serviceUnavailable);
        } else if (update["evse"] !== 0 && evse_state !== 0) {
          // evse booted, modal not active -> pass
        } else if (update["evse"] !== 0 && evse_state === 0) {
          // evse booted, modal still active
          this.dialog.closeAll();
        } else {
          console.log("unknown evse state");
        }
      }
      evse_state = update["evse"];
    })
  }
}
