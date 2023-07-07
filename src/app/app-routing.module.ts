import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddValueComponent } from './add-value/add-value.component';
import { HomeComponent } from './home/home.component';
import { PowerSelectComponent } from './power-select/power-select.component';
import { PaymentComponent } from './payment/payment.component';
import { ChargingComponent } from './charging/charging.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  { path: 'charging', component: ChargingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'power-select', component: PowerSelectComponent },
  { path: 'add-value', component: AddValueComponent },
  { path: 'summary', component: SummaryComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
