import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { AddValueComponent } from './add-value/add-value.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PowerSelectComponent } from './power-select/power-select.component';
import { PaymentComponent } from './payment/payment.component';
import { ChargingComponent } from './charging/charging.component';
import { SummaryComponent } from './summary/summary.component';
import { BatteryComponent } from './battery/battery.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    PowerSelectComponent,
    AddValueComponent,
    PaymentComponent,
    ChargingComponent,
    SummaryComponent,
    BatteryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
