import { Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private router: Router
  ) { }

  goToUrl(urls: string | UrlTree) {
    this.router.navigateByUrl(urls);
  }
  
}
