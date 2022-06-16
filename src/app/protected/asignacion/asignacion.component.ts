import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Asignacion, SubVariable, Variante } from '../../auth/iterfaces/interfaces';
import { ComponenteService } from '../services/componente.service';

import SwiperCore, { Keyboard, Pagination, Navigation, Virtual } from 'swiper';
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class AsignacionComponent implements OnInit {

  @Input()
  listaSubVariable: SubVariable[] = [];

  @Input()
  idComponente!: number;

  idUsuario!: number;

  @Output()
  salidaAsignacionVerdaderas: EventEmitter<Asignacion[]> = new EventEmitter();

  @Output()
  salidaAsignacionFalsas: EventEmitter<Asignacion[]> = new EventEmitter();

  @Output()
  salidaArchivos: EventEmitter<any[]> = new EventEmitter();

  @Output()
  salidaAsignacion: EventEmitter<Asignacion> = new EventEmitter();

  @ViewChild('upload') uploadFile!: FileUpload;

  listaAsignacionPorcentaje: Asignacion[] = [];
  listaAsignacionVerdaderas: Asignacion[] = [];
  listaAsignacionfalsas: Asignacion[] = [];
  habilitarDialogoUrl: boolean = false;
  botonArchivo: boolean = false;
  botonUrl = false;
  columnas: any[] = [];
  archivos: File[] = [];
  responsiveOptions: any[] = [];
  url: string = '';
  i!: number;
  j!: number;
  k!: number;


  constructor(public componenteService: ComponenteService) {
    this.columnas = [
      { field: 'nombre', header: 'Descripción' },
      { field: 'archivoPath', header: 'Archivo' },
    ];

    this.responsiveOptions = [
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
  }

  obtenerRespuesta(i: number, variante: Variante, asignacion: Asignacion) {

    const j = this.listaSubVariable[i].listaVariante.findIndex(v => v.id === variante.id);
    const k = this.listaSubVariable[i].listaVariante[j].listaAsignacion.findIndex(a => a.id === asignacion.id && a.codigoUsuario === Number(this.componenteService.idUsuario));

    for (let l = 0; l < this.listaSubVariable[i].listaVariante[j].listaAsignacion.length; l++) {
      if (this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].codigoUsuario === Number(this.componenteService.idUsuario)) {
        this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].seleccionado = false;
        this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].archivoPath = '';
        this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].url = '';

      }

    }
    this.listaSubVariable[i].listaVariante[j].listaAsignacion[k].seleccionado = true;
    this.uploadFile.clear();
    this.obtenerAsignacionesSeleccionado();
    if (this.listaAsignacionVerdaderas.length === 0) {
      this.obtenerAsignacionesTodas();
    }
    if (!asignacion.archivoPath.includes('_-_')) {
      const indexArchivo = this.archivos.findIndex(archivo => archivo.name === asignacion.archivoPath);
      this.archivos.splice(indexArchivo, 1);
    }
    this.salidaAsignacionVerdaderas.emit(this.listaAsignacionVerdaderas);
    this.salidaArchivos.emit(this.archivos);
    this.salidaAsignacionFalsas.emit(this.listaAsignacionfalsas);
    this.salidaAsignacion.emit(asignacion);

  }

  obtenerRespuestas(i: number, variante: Variante, asignacion: Asignacion) {


    const j = this.listaSubVariable[i].listaVariante.findIndex(v => v.id === variante.id);
    if (!asignacion.archivoContiene) {
      this.asignarAsignacionesFalsas(i, j);
    } else {
      const indexAsignacion = this.listaSubVariable[i].listaVariante[j].listaAsignacion.findIndex(a => a.archivoContiene === false && a.codigoUsuario === Number(this.componenteService.idUsuario));
      this.listaSubVariable[i].listaVariante[j].listaAsignacion[indexAsignacion].seleccionado = false;
    }   

    this.obtenerAsignacionesSeleccionado();
    if (this.listaAsignacionVerdaderas.length === 0) {
      this.obtenerAsignacionesTodas();
    }

    if (asignacion.archivoPath.length > 0 && !asignacion.seleccionado) {
      const indexArchivo = this.archivos.findIndex(archivo => archivo.name === asignacion.archivoPath);
      const indexAsignacion = this.listaSubVariable[i].listaVariante[j].listaAsignacion.findIndex(a => a.id === asignacion.id && a.codigoUsuario === Number(this.componenteService.idUsuario));
      this.listaSubVariable[i].listaVariante[j].listaAsignacion[indexAsignacion].archivoPath = '';
      this.archivos.splice(indexArchivo, 1);
      this.uploadFile.clear();
    }
    this.salidaAsignacionVerdaderas.emit(this.listaAsignacionVerdaderas);
    this.salidaArchivos.emit(this.archivos);
    this.salidaAsignacionFalsas.emit(this.listaAsignacionfalsas);
    this.salidaAsignacion.emit(asignacion);
  }

  asignarAsignacionesFalsas(i: number, j: number) {
    for (let l = 0; l < this.listaSubVariable[i].listaVariante[j].listaAsignacion.length; l++) {
      if (this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].archivoContiene && this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].codigoUsuario === Number(this.componenteService.idUsuario)) {
        this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].seleccionado = false;
        this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].archivoPath = '';
        this.listaSubVariable[i].listaVariante[j].listaAsignacion[l].url = ''
      }
    }
  }

  obtenerAsignacionesSeleccionado() {
    this.listaAsignacionVerdaderas = [];
    this.listaAsignacionfalsas = [];
    for (let i = 0; i < this.listaSubVariable.length; i++) {
      for (let j = 0; j < this.listaSubVariable[i].listaVariante.length; j++) {
        for (let k = 0; k < this.listaSubVariable[i].listaVariante[j].listaAsignacion.length; k++) {
          if (this.listaSubVariable[i].listaVariante[j].listaAsignacion[k].seleccionado) {
            if (this.listaSubVariable[i].listaVariante[j].listaAsignacion[k].codigoUsuario === Number(this.componenteService.idUsuario)) {
              this.listaAsignacionVerdaderas.push(this.listaSubVariable[i].listaVariante[j].listaAsignacion[k]);
            }
          } else {
            if (this.listaSubVariable[i].listaVariante[j].listaAsignacion[k].codigoUsuario === Number(this.componenteService.idUsuario)) {
              this.listaAsignacionfalsas.push(this.listaSubVariable[i].listaVariante[j].listaAsignacion[k]);
            }
          }
        }
      }
    }
  }

  obtenerAsignacionesTodas() {
    this.listaAsignacionVerdaderas = [];
    for (let i = 0; i < this.listaSubVariable.length; i++) {
      for (let j = 0; j < this.listaSubVariable[i].listaVariante.length; j++) {
        for (let k = 0; k < this.listaSubVariable[i].listaVariante[j].listaAsignacion.length; k++) {
          if (this.listaSubVariable[i].listaVariante[j].listaAsignacion[k].codigoUsuario === Number(this.componenteService.idUsuario)) {
            this.listaAsignacionVerdaderas.push(this.listaSubVariable[i].listaVariante[j].listaAsignacion[k]);
            this.listaAsignacionPorcentaje.push(this.listaSubVariable[i].listaVariante[j].listaAsignacion[k]);
          }
        }
      }
    }
  }



  mostrarDialogoUrl(i: number, variante: Variante, asignacion: Asignacion) {
    this.habilitarDialogoUrl = true;
    this.i = i;
    this.j = this.listaSubVariable[i].listaVariante.findIndex(v => v.id === variante.id);
    this.k = this.listaSubVariable[i].listaVariante[this.j].listaAsignacion.findIndex(a => a.id === asignacion.id && a.codigoUsuario === Number(this.componenteService.idUsuario));
    this.url = this.listaSubVariable[i].listaVariante[this.j].listaAsignacion[this.k].url;

  }

  ocultarDialogoURL() {
    this.habilitarDialogoUrl = false;
  }

  cerrarDialogo() {
    this.listaSubVariable[this.i].listaVariante[this.j].listaAsignacion[this.k].url = this.url;
    this.obtenerAsignacionesSeleccionado();
    if (this.listaAsignacionVerdaderas.length === 0) {
      this.obtenerAsignacionesTodas();
    }
    this.salidaAsignacionVerdaderas.emit(this.listaAsignacionVerdaderas);
    this.salidaArchivos.emit(this.archivos);
    this.salidaAsignacionFalsas.emit(this.listaAsignacionfalsas);
  }

  cargarArchivo(i: number, variante: Variante, event: any, upload: any) {
    const j = this.listaSubVariable[i].listaVariante.findIndex(v => v.id === variante.id);
    let index = this.listaSubVariable[i].listaVariante[j].listaAsignacion.findIndex(asignacion => asignacion.seleccionado && asignacion.codigoUsuario === Number(this.componenteService.idUsuario));
    this.listaSubVariable[i].listaVariante[j].listaAsignacion[index].archivoPath = event.files[0].name;
    this.obtenerAsignacionesSeleccionado();
    this.archivos.push(event.files[0]);
    this.salidaAsignacionVerdaderas.emit(this.listaAsignacionVerdaderas);
    this.salidaArchivos.emit(this.archivos);
    this.salidaAsignacionFalsas.emit(this.listaAsignacionfalsas);
    upload.clear();

  }

  cargarArchivos(i: number, variante: Variante, idAsignacion: number, event: any, upload: any) {
    const j = this.listaSubVariable[i].listaVariante.findIndex(v => v.id === variante.id);
    let index = this.listaSubVariable[i].listaVariante[j].listaAsignacion.findIndex(asignacion => asignacion.id === idAsignacion && asignacion.codigoUsuario === Number(this.componenteService.idUsuario));
    this.listaSubVariable[i].listaVariante[j].listaAsignacion[index].archivoPath = event.files[0].name;
    this.obtenerAsignacionesSeleccionado();
    this.archivos.push(event.files[0]);
    this.salidaAsignacionVerdaderas.emit(this.listaAsignacionVerdaderas);
    this.salidaArchivos.emit(this.archivos);
    this.salidaAsignacionFalsas.emit(this.listaAsignacionfalsas);
    upload.clear();
  }

  eliminarArchivo(i: number, variante: Variante, asignacion: Asignacion) {
    const j = this.listaSubVariable[i].listaVariante.findIndex(v => v.id === variante.id);
    if (!asignacion.archivoPath.includes('_-_')) {
      const indexArchivo = this.archivos.findIndex(archivo => archivo.name === asignacion.archivoPath);
      this.archivos.splice(indexArchivo, 1);
    }
    let index = this.listaSubVariable[i].listaVariante[j].listaAsignacion.findIndex(a => a.id === asignacion.id && a.codigoUsuario === Number(this.componenteService.idUsuario));
    this.listaSubVariable[i].listaVariante[j].listaAsignacion[index].archivoPath = "";
    this.obtenerAsignacionesSeleccionado();
    this.salidaAsignacionVerdaderas.emit(this.listaAsignacionVerdaderas);
    this.salidaArchivos.emit(this.archivos);
    this.salidaAsignacionFalsas.emit(this.listaAsignacionfalsas);
    this.uploadFile.clear();

  }

}
