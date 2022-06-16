import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GraficaBarComponent } from './grafica-bar/grafica-bar.component';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    GraficaBarComponent
  ],
  imports: [
    CommonModule,
    HighchartsChartModule,
    RouterModule  
  ],
  exports: [
    GraficaBarComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
