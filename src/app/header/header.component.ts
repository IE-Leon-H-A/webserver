import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  constructor(
    public router: Router,
    private dialogReference: MatDialog
  ) { }

  ngOnInit(): void {
  }


  goBack() {
    if (this.router.url === '/power-select') {
      this.router.navigateByUrl('/home');
    }

    if (this.router.url.includes('/add-value')) {
      this.router.navigateByUrl('/power-select');
    }
  }

  openDialog(){
    this.dialogReference.open(ModalComponent);
  }

}
