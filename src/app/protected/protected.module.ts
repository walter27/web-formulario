import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProtectedRoutingModule } from './protected-routing.module';

import { MainComponent } from './main/main.component';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { GraficaComponent } from './grafica/grafica.component';

import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { ValidarListaPipe } from './pipes/validar-lista.pipe';
import { ValidarNombrePipe } from './pipes/validar-nombre.pipe';
import { ValidarAsignacionPipe } from './pipes/validar-asignacion.pipe';
import { ConvertirStringPipe } from './pipes/convertir-string.pipe';
import { CortarPathPipe } from './pipes/cortar-path.pipe';
import { ValidarPathPipe } from './pipes/validar-path.pipe';

import { SwiperModule } from 'swiper/angular';

import { HighchartsChartModule } from 'highcharts-angular';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MainComponent,
    PreguntasComponent,
    AsignacionComponent,
    ValidarListaPipe,
    ValidarNombrePipe,
    ValidarAsignacionPipe,
    ConvertirStringPipe,
    CortarPathPipe,
    ValidarPathPipe,
    GraficaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ProtectedRoutingModule,
    DropdownModule,
    DialogModule,
    CheckboxModule,
    ButtonModule,
    TooltipModule,
    FileUploadModule,
    ProgressSpinnerModule,
    StepsModule,
    HighchartsChartModule,
    SharedModule,
    ProgressBarModule,
    MessageModule,
    MessagesModule,
    SwiperModule
  ]
})
export class ProtectedModule { }
