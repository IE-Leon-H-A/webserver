import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SharedService} from '../_services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(
    private dialogRef: MatDialog,
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.sharedService.sock.removeAllListeners();
    this.dialogRef.closeAll();
    this.sharedService.ev_soc = 0;
    this.sharedService.cash_spent = 0;
    this.sharedService.cash_left = 0;
    this.sharedService.charging_power = 0;
    this.sharedService.time_remaining = 0;
    this.sharedService.energy_transfered = 0;
  }

}
