import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(private dialogRef: MatDialog) {

    this.dialogRef.closeAll();
  }

  ngOnInit(): void {
  }

}
