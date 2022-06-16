import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validarPath'
})
export class ValidarPathPipe implements PipeTransform {

  transform(path: string): boolean {
    return path.includes('_-_');
  }

}
