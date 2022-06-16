import { Pipe, PipeTransform } from '@angular/core';
import { Asignacion } from '../../auth/iterfaces/interfaces';
import { ComponenteService } from '../services/componente.service';

@Pipe({
  name: 'validarAsignacion'
})
export class ValidarAsignacionPipe implements PipeTransform {

  listaAsignacion: Asignacion[] = [];

  constructor(private componenteService:ComponenteService){
    
  }

  transform(listaAsignacion: Asignacion[]): Asignacion[] {
    
    for (let i = 0; i < listaAsignacion.length; i++) {
      if (listaAsignacion[i].codigoUsuario === Number(this.componenteService.idUsuario )) {
        this.listaAsignacion.push(listaAsignacion[i]);
      }
    }
    return this.listaAsignacion;
  }

}
