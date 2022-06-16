import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertirString'
})
export class ConvertirStringPipe implements PipeTransform {

  transform(id: number): string {
    return `${id}`;
  }

}
