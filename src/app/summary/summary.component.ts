import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {SharedService} from '../_services/shared.service';
import {jsDocComment} from "@angular/compiler";


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
        private sharedService: SharedService,
    ) {
        this.dialogRef.closeAll();
    }

    ngOnInit(): void {
        //     this.sharedService.sock.on('charge_session_summary', (message: any) => {
        //         let telemetry = JSON.parse(message);
        //         console.log(message);
        //
        //         this.soc = telemetry["soc"];
        //         this.spent_energy_kwh = telemetry["spent_energy_kwh"];
        //         this.money_spent = telemetry["money_spent"];
        //     })
        //
        //     this.sharedService.sock.emit("charge_session_summary");
        // }
    }
}
