import { Pipe, PipeTransform } from '@angular/core';
import { Variante, SubVariable } from '../../auth/iterfaces/interfaces';

@Pipe({
  name: 'validarNombre'
})
export class ValidarNombrePipe implements PipeTransform {

  listaVariante: Variante[] = [];

  transform(subVariable: SubVariable, id: number): boolean {
    for (let i = 0; i < subVariable.listaVariante.length; i++) {
      if (subVariable.listaVariante[i].codigoComponente === String(id)) {
        this.listaVariante.push(subVariable.listaVariante[i])
      }
    }
    if (this.listaVariante.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
