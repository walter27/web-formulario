import { Component, Input, OnInit } from '@angular/core';
import { ComponenteService } from '../../protected/services/componente.service';
import { Categoria, Dato, Variable, ResultadoVariante, Variante, Usuario } from '../../auth/iterfaces/interfaces';

import * as Highcharts from "highcharts";
import MO_Highcharts from 'highcharts/highcharts-more';
import HC_accessibility from 'highcharts/modules/accessibility';

@Component({
  selector: 'app-grafica-bar',
  templateUrl: './grafica-bar.component.html',
  styleUrls: ['./grafica-bar.component.css']
})
export class GraficaBarComponent implements OnInit {

  @Input()
  usuario!: Usuario;

  @Input()
  variable!: Variable;

  @Input()
  listaVarianteResultado!: ResultadoVariante[];

  highcharts: any;

  habilitarSpinnerError: boolean = false;
  listaVariante: Variante[] = [];
  listaDataBar: Dato[] = []
  listaCategoriaBar: string[] = [];
  chartOptionsBar!: {};
  updateDemo!: boolean;

  constructor(
    private componenteService: ComponenteService
  ) {
    this.highcharts = Highcharts;
    HC_accessibility(this.highcharts);
    MO_Highcharts(this.highcharts);
  }

  ngOnInit(): void {
    this.listaVarianteResultado = this.listaVarianteResultado.filter(resultadoVariante => resultadoVariante.codigoVariable === this.variable.id)
    this.obtenerVariante();
  }

  obtenerVariante() {
    this.componenteService.listarVariante().subscribe(
      {
        next: (resp) => {
          this.listaVariante = resp;
          this.obtenerCategoria();
          this.obtenerData();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    )
  }

  obtenerCategoria() {
    this.listaCategoriaBar = [];
    for (const variante of this.listaVariante) {
      if (this.listaVarianteResultado.find(resultadoVariante => resultadoVariante.codigoVariante === variante.id)?.codigoVariante === variante.id) {
        this.listaCategoriaBar.push(variante.nombre);
      }
    }
  }

  obtenerData() {
    this.listaDataBar = [];
    let dato: number[] = [];
    for (const resultadoVariante of this.listaVarianteResultado) {
      dato.push(resultadoVariante.normalizacion);
    }

    let data: Dato = {
      name: '',
      data: []
    };
    data.data = dato;
    data.name = this.usuario.nombreGad;
    this.listaDataBar.push(data);
    this.createBar();
  }

  createBar() {
    this.chartOptionsBar = {
      chart: {
        events: {
          load: (e: any) => {
            for (let i = 0; i < e.target.series[0].points.length; i++) {
              if (e.target.series[0].points[i].y === 1) {
                e.target.series[0].points[i].update({
                  color: '#00B050'
                });
              }
              if (e.target.series[0].points[i].y === 0.75) {
                e.target.series[0].points[i].update({
                  color: '#92D050'
                });
              }
              if (e.target.series[0].points[i].y === 0.50) {
                e.target.series[0].points[i].update({
                  color: '#FFFB00'
                });
              }
              if (e.target.series[0].points[i].y === 0.25) {
                e.target.series[0].points[i].update({
                  color: '#FFC000'
                });
              }
            }
          }
        },
        type: 'bar',
        borderRadius: 20,
        marginTop: 50,
      },
      title: {
        text: this.variable.nombre
      },
      subtitle: {
        text: null
      },
      xAxis: {
        categories: this.listaCategoriaBar,
        title: {
          text: "Items",
        },
        labels: {
          formatter: (e: any) => {
            if (this.asignarColor(e.pos)) {
              return '<span style="fill: red;">' + e.value + '</span>';
            } else {
              return e.value;
            }
          }
        }
      },
      yAxis: {
        min: 0,
        max: 1,
        title: {
          text: "Nivel de cumplimiento",
        },
        labels: {
          overflow: 'justify'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
      },
      exporting: { enabled: false },
      series: this.listaDataBar
    }
    this.updateDemo = true;
  }

  asignarColor(posicion: number): boolean {
    if (this.listaDataBar[0].data[posicion] === 0) {
      return true;
    } else {
      return false
    }

  }

  mostrarSpinnerError() {
    this.habilitarSpinnerError = true;
    setTimeout(() => {
      this.habilitarSpinnerError = false;
    }, 3000);
  }

}
