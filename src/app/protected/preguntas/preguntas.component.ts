import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ComponenteService } from '../services/componente.service';
import { Componente, Variable, Asignacion, Usuario } from '../../auth/iterfaces/interfaces';

import { MenuItem, Message } from 'primeng/api';



@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class PreguntasComponent implements OnInit {

  listaUsuario: Usuario[] = [];
  usuarioSeleccionado!: Usuario;
  listaComponente: Componente[] = [];
  listaVariable: Variable[] = [];
  variableSeleccionada!: Variable;
  componenteSeleccionado!: Componente;
  listaAsignacionVerdaderas: Asignacion[] = [];
  listaAsignacionFalsas: Asignacion[] = [];
  listaAsignacionUsuario: Asignacion[] = [];
  listaArchivos: File[] = [];
  habilitarSpinnerCarga: boolean = false;
  habilitarSpinnerExito: boolean = false;
  habilitarSpinnerError: boolean = false;
  items: MenuItem[] = [];
  active: number = 0;
  activarStep: boolean = false;
  activarSpinner: boolean = false;
  activarBotonResultados: boolean = false;
  activarVariacionRespuestas: boolean = false;
  porcentaje: number = 0;


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (window.innerWidth < 1220) {
      this.componenteService.mostrarCarousel = true;
    } else {
      this.componenteService.mostrarCarousel = false;
      this.obtenerComponentes();
    }
  }

  mensajeComponente: Message[] = [];

  constructor(
    public componenteService: ComponenteService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (window.innerWidth < 1220) {
      this.componenteService.mostrarCarousel = true;
    } else {
      this.componenteService.mostrarCarousel = false;
    }
    if (this.actRoute.snapshot.params['user'] != "administrador") {
      this.componenteService.idUsuario = this.actRoute.snapshot.params['user'];
      this.obtenerComponentes();
    } else {
      this.obtenerListaUsuario();
    }
  }

  obtenerData() {
    this.componenteService.idUsuario = this.usuarioSeleccionado.id;
    this.obtenerComponentes();
  }

  obtenerListaUsuario() {
    this.componenteService.listarUsuario().subscribe(resp => {
      this.listaUsuario = resp;
      this.usuarioSeleccionado = resp[0];
      this.componenteService.idUsuario = this.usuarioSeleccionado.id;
      this.obtenerComponentes();
    });
  }

  mostrarInformacionComponente() {
    if (this.componenteSeleccionado.id === 1) {
      this.mensajeComponente = [
        { severity: 'info', summary: '', detail: 'En esta sección evaluaremos 24 ítems correspondientes a 4 dimensiones del Índice de Integridad Pública a Nivel Local. En la herramienta encontrará cada ítem con sus respectivas categorías de calificación. En este componente, las categorías de calificación son excluyentes entre sí y se permite únicamente seleccionar una categoría. Por favor, seleccione la categoría que corresponda a la calificación del ítem según el verificable con que se cuente. Para más información sobre el tipo de verificable requerido para cada categoría refiérase a la Guía de Implementación del Índice de Integridad Pública a Nivel Local.' },
      ];
    }
    if (this.componenteSeleccionado.id == 2) {
      this.mensajeComponente = [
        { severity: 'info', summary: '', detail: 'En esta sección evaluaremos 20 ítems correspondientes a 4 dimensiones del Índice de Integridad Pública a Nivel Local. En la herramienta encontrará cada ítem con sus respectivas categorías de calificación. En este componente, las categorías de calificación son acumulativas y se permite seleccionar una o más categorías. Por favor, seleccione todas las categorías que correspondan a la calificación del ítem según los verificables con los que cuente. Adjuntar el verificable correspondiente a la categoría más alta de calificación. Para más información sobre el tipo de verificable requerido para cada categoría refiérase a la Guía de Implementación del Índice de Integridad Pública a Nivel Local. Al finalizar con la selección de categoría, recuerde insertar el adjunto del verificable. Una vez completados todos los ítems, no olvide guardar sus respuestas antes de continuar a la siguiente sección.' },
      ];
    }
  }

  habilitarBotonResultados() {
    if (this.porcentaje === 100 && this.active === 3 && this.componenteSeleccionado.id === 2 && !this.activarVariacionRespuestas) {
      this.activarBotonResultados = true;
    } else {
      this.activarBotonResultados = false;
    }
  }

  visualizarResultados() {
    this.router.navigateByUrl(`/formulario/resultados/${this.componenteService.idUsuario}`);
  }


  obtenerComponentes() {
    this.componenteService.listarComponente().subscribe(
      {
        next: (resp) => {
          this.items = [];
          this.listaComponente = resp;
          this.componenteSeleccionado = resp[0];
          this.listaVariable = this.componenteSeleccionado.listaVariables;
          for (const variable of this.listaVariable) {
            let item: MenuItem = { label: variable.nombre };
            this.items.push(item);
          }
          this.variableSeleccionada = this.listaVariable[0];
          this.mostrarInformacionComponente();
          this.listarAsignaciones();
          this.iterarVariables();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    );
  }

  obtenerVariables() {
    this.activarStep = false;
    this.active = 0;
    this.items = [];
    this.listaVariable = this.componenteSeleccionado.listaVariables;
    for (const variable of this.listaVariable) {
      let item: MenuItem = { label: variable.nombre };
      this.items.push(item);
    }
    this.mostrarInformacionComponente();
    this.iterarVariables();
    this.habilitarBotonResultados();
  }

  obtenerAsignaciones(index: number) {
    this.active = index;
    this.listaVariable = this.componenteSeleccionado.listaVariables;
    this.variableSeleccionada = this.listaVariable[index];
    this.habilitarBotonResultados();
  }

  obtenerRespuestaVerdaderas(listaAsignacionVerdaderas: Asignacion[]) {
    this.activarVariacionRespuestas = true;
    this.listaAsignacionVerdaderas = listaAsignacionVerdaderas;
  }

  obtenerRespuestaFalsas(listaAsignacionFalsas: Asignacion[]) {
    this.activarVariacionRespuestas = true;
    this.listaAsignacionFalsas = listaAsignacionFalsas;
  }

  obtenerArchivos(archivos: File[]) {
    this.activarVariacionRespuestas = true;
    this.listaArchivos = archivos;
  }

  obtenerAsignacion(asignacionE: Asignacion) {
    if (this.componenteSeleccionado.id === 2) {
      const indexAsignacion = this.listaAsignacionUsuario.findIndex(a => a.id === asignacionE.id);
      this.listaAsignacionUsuario[indexAsignacion] = asignacionE;
    } else {
      let listaAsignacion: Asignacion[] = this.listaAsignacionUsuario.filter(a => a.codigoVariante === asignacionE.codigoVariante);
      for (let i = 0; i < listaAsignacion.length; i++) {
        let indexAsignacion = this.listaAsignacionUsuario.findIndex(a => a.id === listaAsignacion[i].id);
        if (listaAsignacion[i].id === asignacionE.id) {
          this.listaAsignacionUsuario[indexAsignacion] = asignacionE;
        } else {
          this.listaAsignacionUsuario[indexAsignacion].seleccionado = false;
        }
      }
    }
    this.calcularPorcentaje();
  }

  listarAsignaciones() {
    this.componenteService.listarAsignaciones().subscribe(
      {
        next: (resp) => {
          this.listaAsignacionUsuario = resp;
          this.calcularPorcentaje();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    )
  }

  calcularPorcentaje() {
    let listaAsignacionPorcentaje: Asignacion[] = [];
    listaAsignacionPorcentaje = this.listaAsignacionUsuario.filter(asignacion => asignacion.seleccionado === true);
    if (listaAsignacionPorcentaje.length === 0) {
      this.porcentaje = 0;
    }
    if (listaAsignacionPorcentaje.length > 0 && listaAsignacionPorcentaje.length <= 5) {
      this.porcentaje = 10;
    }
    if (listaAsignacionPorcentaje.length > 5 && listaAsignacionPorcentaje.length <= 10) {
      this.porcentaje = 20;
    }
    if (listaAsignacionPorcentaje.length > 10 && listaAsignacionPorcentaje.length <= 15) {
      this.porcentaje = 30;
    }
    if (listaAsignacionPorcentaje.length > 15 && listaAsignacionPorcentaje.length <= 20) {
      this.porcentaje = 40;
    }
    if (listaAsignacionPorcentaje.length > 20 && listaAsignacionPorcentaje.length <= 25) {
      this.porcentaje = 50;
    }
    if (listaAsignacionPorcentaje.length > 25 && listaAsignacionPorcentaje.length <= 30) {
      this.porcentaje = 60;
    }
    if (listaAsignacionPorcentaje.length > 30 && listaAsignacionPorcentaje.length <= 35) {
      this.porcentaje = 70;
    }
    if (listaAsignacionPorcentaje.length > 35 && listaAsignacionPorcentaje.length <= 40) {
      this.porcentaje = 80;
    }
    if (listaAsignacionPorcentaje.length > 40 && listaAsignacionPorcentaje.length < 44) {
      this.porcentaje = 90;
    }
    if (listaAsignacionPorcentaje.length >= 44) {
      this.porcentaje = 100;
    }
    this.habilitarBotonResultados();
  }

  obtenerRespuestasVerdaderas(variable: Variable) {
    for (let j = 0; j < variable.listaSubVariable.length; j++) {
      for (let k = 0; k < variable.listaSubVariable[j].listaVariante.length; k++) {
        if (variable.listaSubVariable[j].listaVariante[k].codigoComponente === `${this.componenteSeleccionado.id}`) {
          let listaAsignacion: Asignacion[] = variable.listaSubVariable[j].listaVariante[k].listaAsignacion.filter(a => a.seleccionado === true && a.codigoUsuario === Number(this.componenteService.idUsuario));
          if (listaAsignacion.length == 0) {
            this.active = this.items.findIndex(item => item.label === variable.nombre);
            this.activarStep = true;
            if (this.active === (this.listaVariable.length - 1)) {
              this.variableSeleccionada = this.listaVariable[this.active];
            }
            return;
          } else {
            if (this.active == 3) {
              this.active = this.items.findIndex(item => item.label === variable.nombre);
            }
          }
        }
      }
    }
    if (this.listaVariable[0].id != variable.id) {
      this.active = this.active + 1;
    }
    if (this.active === (this.listaVariable.length - 1)) {
      this.variableSeleccionada = this.listaVariable[this.active];
    }
    this.activarVariacionRespuestas=false;
    this.habilitarBotonResultados();
    //this.listarAsignaciones();
  }

  iterarVariables() {
    for (let i = 0; i < this.listaVariable.length; i++) {
      if (!this.activarStep) {
        this.obtenerRespuestasVerdaderas(this.listaVariable[i]);
      } else {
        this.variableSeleccionada = this.listaVariable[this.active];
        return;
      }
    }
  }

  guardarRespuestas() {
    this.activarStep = false;
    this.active = 0;
    if (this.listaArchivos.length > 0) {
      this.componenteService.registrarRespuestasVerdaderas(this.listaAsignacionVerdaderas, this.listaArchivos).subscribe(
        {
          next: (resp) => {
            this.regisrarRespuestasFalsas();
          },
          error: () => {
            this.mostrarSpinnerError();
          }
        });
    } else {
      this.componenteService.registrarAsignaciones(this.listaAsignacionVerdaderas).subscribe(
        {
          next: (resp) => {
            this.regisrarRespuestasFalsas();
          },
          error: () => {
            this.mostrarSpinnerError();
          }
        });

    }
  }

  regisrarRespuestasFalsas() {
    this.componenteService.registrarRespuestasFalsas(this.listaAsignacionFalsas).subscribe(
      {
        next: (resp) => {
          this.mostrarSpinnerCarga(resp);
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      });
  }

  mostrarSpinnerCarga(resp: any) {
    if (resp.estado === true) {
      this.habilitarSpinnerCarga = true;
      setTimeout(() => {
        this.habilitarSpinnerCarga = false;
        setTimeout(() => {
          this.habilitarSpinnerExito = true;
          setTimeout(() => {
            this.habilitarSpinnerExito = false;
            if (this.active === 0) {
              this.iterarVariables();
            }
          }, 3000);
        }, 1000);
      }, 3000);

    }
  }

  mostrarSpinnerError() {
    this.habilitarSpinnerError = true;
    setTimeout(() => {
      this.habilitarSpinnerError = false;
    }, 3000);
  }

  retrocederStep() {
    if (this.active > 0 || this.active <= 3) {
      this.active = this.active - 1;
      this.listaVariable = this.componenteSeleccionado.listaVariables;
      this.variableSeleccionada = this.listaVariable[this.active];
      this.habilitarBotonResultados();
    }
  }

  avanzarStep() {
    let index = this.listaVariable.findIndex(variable => variable.id === this.variableSeleccionada.id);
    this.active = index + 1;
    this.listaVariable = this.componenteSeleccionado.listaVariables;
    this.variableSeleccionada = this.listaVariable[this.active];
    this.habilitarBotonResultados();

  }
}
