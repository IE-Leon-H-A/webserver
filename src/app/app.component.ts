import { Component } from '@angular/core';
import { Event, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'punionica';
  url = 'home';

  constructor(
    public router: Router,
  ) {

    router.events.pipe(filter((e: Event): e is RouterEvent => e instanceof NavigationEnd))
      .subscribe((e) => {
        if (router.url === '/') {
          this.url = 'home'
        } else {
          this.url = router.url.substring(1);
        }

        console.log(this.url);
      });
  }
}
