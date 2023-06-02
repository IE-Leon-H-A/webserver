import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-charging',
  templateUrl: './charging.component.html',
  styleUrls: ['./charging.component.scss']
})
export class ChargingComponent implements OnInit {

  constructor(private dialogRef: MatDialog) {

    this.dialogRef.closeAll();
  }

  ngOnInit(): void {
  }


}
