import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cortarPath'
})
export class CortarPathPipe implements PipeTransform {

  transform(path:string):string {
    return path.split('_-_')[1];
  }

}
