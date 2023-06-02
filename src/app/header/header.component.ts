import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  constructor(
    public router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
    });

  }

  closeDialog(dialogName: any) {
    this.dialog.closeAll();
  }

}
