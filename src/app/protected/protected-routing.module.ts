import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { GraficaComponent } from './grafica/grafica.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'preguntas/:user', component: PreguntasComponent },
      { path: 'resultados/:user', component: GraficaComponent },
      { path: '**', redirectTo: 'preguntas' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
