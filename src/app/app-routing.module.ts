import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddValueComponent } from './add-value/add-value.component';
import { HomeComponent } from './home/home.component';
import { PowerSelectComponent } from './power-select/power-select.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'power-select', component: PowerSelectComponent },
  { path: 'add-value/:power/:price', component: AddValueComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
