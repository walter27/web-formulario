import { Pipe, PipeTransform } from '@angular/core';
import { Variante } from '../../auth/iterfaces/interfaces';

@Pipe({
  name: 'validarLista'
})
export class ValidarListaPipe implements PipeTransform {

  listaVariante: Variante[] = [];

  transform(listaVariante: Variante[], id: number): Variante[] {    
    for (let i = 0; i < listaVariante.length; i++) {
      if (listaVariante[i].codigoComponente === String(id)) {
        this.listaVariante.push(listaVariante[i])
      }
    }
    return this.listaVariante;
  }
}
