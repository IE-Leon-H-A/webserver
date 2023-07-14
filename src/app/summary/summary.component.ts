import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {SharedService} from '../_services/shared.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnInit {

  soc = 0;
  spent_energy_kwh = 0;
  money_spent = 0;

  constructor(
    private dialogRef: MatDialog,
    private shared: SharedService,
    private router: Router
  ) {
    this.dialogRef.closeAll();
  }

  ngOnInit(): void {
    this.soc = this.shared.ev_soc;
    this.spent_energy_kwh = this.shared.energy_transfered;
    this.money_spent = this.shared.cash_spent;

    setTimeout(() => {
      if (this.router.url === "/summary") {
        this.router.navigateByUrl("/home");
      }
    }, 10000)
  }
}
