import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as Highcharts from "highcharts";
import MO_Highcharts from 'highcharts/highcharts-more';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_exporting from "highcharts/modules/exporting";
import HC_export from "highcharts/modules/export-data";

import { ComponenteService } from '../services/componente.service';
import { Dato, Variable, ResultadoVariante, ResultadoVariable, Usuario, Recomendacion } from '../../auth/iterfaces/interfaces';
import { ActivatedRoute } from '@angular/router';

(function (Highcharts: any) {
  /**
   * Create a global getSVG method that takes an array of charts as an
   * argument  
   */
  Highcharts.getSVG = function (charts: any) {
    var svgArr: any = [],
      top = 0,
      width = 0;

    Highcharts.each(charts, function (chart: any) {
      var svg = chart.getSVG(),
        // Get width/height of SVG for export
        svgWidth = +svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1],
        svgHeight = +svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1];

      svg = svg.replace(
        "<svg",
        '<g transform="translate(' + width + ', 0 ) rotate(270 300 300)" '
      );
      svg = svg.replace("</svg>", "</g>");

      width += svgHeight;
      top = Math.max(top, svgWidth);

      svgArr.push(svg);
    });

    return (
      '<svg height="' +
      top +
      '" width="' +
      width +
      '" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
      svgArr.join("") +
      "</svg>"
    );
  };

  /**
   * Create a global exportCharts method that takes an array of charts as an
   * argument, and exporting options as the second argument
   */
  Highcharts.exportCharts = function (charts: any, options: any) {

  /**   charts.forEach(function (chart: any) {
      chart.update({
        chart: { }
      });
    });*/

    // Merge the options
    options = Highcharts.merge(Highcharts.getOptions().exporting, options);

    // Post to export server
    Highcharts.post(options.url, {
      filename: options.filename || "resultados",
      type: options.type,
      width: options.width,
      svg: Highcharts.getSVG(charts)
    });

    charts.forEach(function (chart: any) {
      chart.update({
        chart: {
          borderWidth: 0
        }
      });
    });
  };
})(Highcharts);

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class GraficaComponent implements OnInit {

  updateDemo!: boolean;
  highcharts: any;
  chartOptions: any = {};
  habilitarSpinnerError: boolean = false;
  listaResultadoVariante: ResultadoVariante[] = [];
  listaResultadoVariable: ResultadoVariable[] = [];
  listaCategoriaRadar: string[] = [];
  listaVariable: Variable[] = [];
  listaDataRadar: Dato[] = []
  listaRecomendacion: Recomendacion[] = [];
  average!: number;
  usuario!: Usuario;

  constructor(
    private componenteService: ComponenteService,
    private actRoute: ActivatedRoute,) {
    this.highcharts = Highcharts;
    HC_accessibility(this.highcharts);
    MO_Highcharts(this.highcharts);
    HC_exporting(this.highcharts);
    HC_export(this.highcharts);
    this.componenteService.idUsuario = this.actRoute.snapshot.params['user'];
    this.calcularNormalizacionVariante();
  }

  ngOnInit(): void {
    this.buscarUsuario();
  }

  buscarUsuario() {
    this.componenteService.buscarUsuario(this.componenteService.idUsuario).subscribe(
      {
        next: (resp) => {
          this.usuario = resp;
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    )
  }

  listarNormalizacionVariante() {
    this.componenteService.listarNormalizacionVariante().subscribe(
      {
        next: (resp) => {
          this.listaResultadoVariante = [];
          this.listaResultadoVariante = resp;
          this.calcularNormalizacionVariable();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    )
  }

  listaNormalizacionVariable() {
    this.componenteService.listarNormalizacionVariable().subscribe(
      {
        next: (resp) => {
          this.listaResultadoVariable = [];
          this.listaResultadoVariable = resp;
          this.obtenerVariable();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    )
  }


  calcularNormalizacionVariante() {
    this.componenteService.calcularNormalizacionVariante().subscribe(
      {
        next: (resp: any) => {
          this.listarNormalizacionVariante();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    )
  }

  calcularNormalizacionVariable() {
    this.componenteService.calcularNormalizacionVariable().subscribe(
      {
        next: (resp) => {
          this.listaNormalizacionVariable();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    )
  }

  obtenerVariable() {
    this.componenteService.listarVariable().subscribe(
      {
        next: (resp) => {
          this.listaVariable = resp;
          this.obtenerCategoria();
          this.obtenerData();
        },
        error: () => {
          this.mostrarSpinnerError();
        }
      }
    );
  }

  obtenerCategoria() {
    this.listaCategoriaRadar = [];
    for (const variable of this.listaVariable) {
      if (this.listaResultadoVariable.find(resultadoVariable => resultadoVariable.codigoVariable === variable.id)?.codigoVariable === variable.id) {
        this.listaCategoriaRadar.push(variable.nombre);
      }
    }
  }

  obtenerData() {
    this.listaDataRadar = [];
    let dato: number[] = [];
    for (const resultadoVariable of this.listaResultadoVariable) {
      dato.push(resultadoVariable.normalizacion);
    }

    let data: Dato = {
      name: '',
      data: []
    };
    data.data = dato;
    data.name = this.usuario.nombreGad;
    this.listaDataRadar.push(data);
    this.calcularAverage();
    this.createRadar();
  }

  calcularAverage() {
    let dato: number[] = [];
    var total = 0;
    for (const resultadoVariante of this.listaResultadoVariante) {
      dato.push(resultadoVariante.normalizacion);
    }
    for (var i = 0; i < dato.length; i++) {
      total += dato[i];
    }
    var multiplier = Math.pow(10, 2 || 0);
    this.average = Math.round((total / dato.length) * multiplier) / multiplier;


  }

  mostrarSpinnerError() {
    this.habilitarSpinnerError = true;
    setTimeout(() => {
      this.habilitarSpinnerError = false;
    }, 3000);
  }

  createRadar() {
    this.chartOptions = {
      chart: {
        polar: true,
        type: 'line',
        borderRadius: 20,
        marginTop: 90
      },
      title: {
        text: `Valor total del índice ${this.average}`,
      },
      pane: {
        size: '80%'
      },
      xAxis: {
        categories: this.listaCategoriaRadar,
        tickmarkPlacement: 'on',
        lineWidth: 0,
        labels: {
          align: 'center',
          distance: 30
        }
      },
      yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
        max: 1,
        tickPositioner: function (min: any, max: any) {
          return [min, max];
        }
      },
      plotOptions: {
        series: {
          colorByPoint: true,
          colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572'],
          dataLabels: {
            enabled: true,
            crop: false,
            inside: true,
            format: "{y}",
            color: "black",
          },
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          let chart: any = this;
          let tooltip = `<strong style="color:${chart.color}; font-size: 15px">${chart.x} </strong></br>
          <span style="color: ${chart.color}">●</span> <strong style="color: ${chart.color}">${chart.point.series.userOptions.name}: ${chart.y}</strong> </br>`
          if (chart.x === 'Transparencia activa e información sobre el municipio') {
            tooltip = tooltip + `<table>
            <thead>
                <tr style="text-align: center; ">
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Valor</span></th>
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Recomendación</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>0.50≤v&lt;1.00</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>El municipio debe migrar toda la información</span><br>
                        <span> hacía canales de datos abiertos y asegurar </span><br>
                        <span>que la información sea fácil de acceder. </span><br>
                        <span>Toda la información debe ser descargable</span><br>
                        <span> y en formato ‘machine readable’.</span></td>
                </tr>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"> <span>0.00≤v&lt;0.50</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>El municipio debe generar información</span><br>
                        <span> municipal en todos los aspectos, ampliar</span><br>
                        <span> los canales de difusión de la información, </span><br>
                        <span>y mejorar la calidad de los datos de la información.</span></td>
                </tr>
            </tbody>
        </table>`;
          }
          if (chart.x === 'Compras públicas y contrataciones') {
            tooltip = tooltip + `<table>
            <thead>
                <tr style="text-align: center; ">
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Valor</span></th>
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Recomendación</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>0.50≤v&lt;1.00</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio se debe asegurar de que</span><br>
                        <span>toda la información existente sobre</span><br>
                        <span>procesada. compras y contratación</span><br>
                        <span>pública sea También, el municipio debe</span><br>
                        <span>presentar la información en formato de datos </span><br>
                        <span>abiertos (descargable y ‘machine readable’)</span></td>
                </tr>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"> <span>0.00≤v&lt;0.50</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe generar información</span><br>
                        <span>y asegurarse de que esta repose en</span><br>
                        <span>lado, es decir, que existan respaldos</span><br>
                        <span> institucionales de la misma.</span></td>
                </tr>
            </tbody>
        </table>`
          }

          if (chart.x === 'Acceso a la información pública') {
            tooltip = tooltip + `<table>
            <thead>
                <tr style="text-align: center; ">
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Valor</span></th>
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Recomendación</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>0.50≤v&lt;1.00</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe procesar la información</span><br>
                        <span>existente y generar informes con estadísticas</span><br>
                        <span>sobre el acceso a la información pública.</span><br>
                        <span>Una vez cumpla con todo lo solicitado</span><br>
                        <span>en la LOTAIP, el municipio debe asegurarse de</span><br>
                        <span>que toda la información municipal sea</span><br>
                        <span>sea accesible y que se encuentre</span><br>
                        <span>en formato de datos abiertos.</span></td>
                </tr>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"> <span>0.00≤v&lt;0.50</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe mejorar su cumplimiento</span><br>
                        <span>con lo establecido en la LOTAIP e</span><br>
                        <span> implementar canales de acceso a la información</span></td>
                </tr>
            </tbody>
        </table>`
          }
          if (chart.x === 'Participación ciudadana') {
            tooltip = tooltip + `<table>
            <thead>
                <tr style="text-align: center; ">
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Valor</span></th>
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Recomendación</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>0.50≤v&lt;1.00</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe mejorar los medios</span><br>
                        <span>y canales necesarios para asegura</span><br>
                        <span>la participación ciudadana. También,</span><br>
                        <span>el municipio debe procesar la</span><br>
                        <span>información sobre participación </span><br>
                        <span>ciudadana y que esta conste en</span><br>
                        <span>en formato de datos abiertos.</span></td>
                </tr>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"> <span>0.00≤v&lt;0.50</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe implementar mecanismos</span><br>
                        <span>y canales que hagan efectiva la</span><br>
                        <span>participación ciudadana y asegurarse de</span><br>
                       <span>la existencia de protocolos y normas</span><br>
                       <span>que establezcan el mecanismo.</span>
                    </td>
                </tr>
            </tbody>
        </table>`
          }
          if (chart.x === 'Cultura de integridad pública y anticorrupción') {
            tooltip = tooltip + `<table>
            <thead>
                <tr style="text-align: center; ">
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Valor</span></th>
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Recomendación</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>0.50≤v&lt;1.00</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>Se debe fortalecer las capacidades</span><br>
                        <span>del municipio, incentivar la cultura</span><br>
                        <span>organizacional abierta y asegurar el</span><br>
                        <span>compromiso de los servidores con la</span><br>
                        <span>integridad pública. El municipio debe</span><br>
                        <span>cumplir con normativa, mecanismos</span><br>
                        <span>y acciones que incentiven la</span><br>
                        <span>cultura de integridad y anticorrupción.</span></td>
                </tr>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"> <span>0.00≤v&lt;0.50</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe incluir en la</span><br>
                        <span>planificación del GAD  un enfoque de</span><br>
                        <span>integridad. También, se deben tomar</span><br>
                        <span>acciones más claras en cuanto a</span><br>
                        <span>la integridad y la transparencia en </span><br>
                        <span>odas las acciones institucionales.</span>
                    </td>
                </tr>
            </tbody>
        </table>`
          }
          if (chart.x === 'Captura institucional') {
            tooltip = tooltip + `<table>
            <thead>
                <tr style="text-align: center; ">
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Valor</span></th>
                    <th style="border: ${chart.color} solid 1px;"><span style="color:${chart.color};">Recomendación</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"><span>0.50≤v&lt;1.00</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe cumplir con generar</span><br>
                        <span>información y que esta se encuentre</span><br>
                        <span>en formato de datos abiertos. Además,</span><br>
                        <span>debe realizar más esfuerzos para</span><br>
                        <span>transparentar la información a la ciudadanía.</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;"> <span>0.00≤v&lt;0.50</span></td>
                    <td style="border: ${chart.color} solid 1px; padding: 7px;">
                        <span>El municipio debe aumentar la</span><br>
                        <span>voluntad política de los funcionarios</span><br>
                        <span>con la transparencia y la integridad</span><br>
                        <span>para contar con informes sobre confictos</span><br>
                        <span>de interés de servidores públicos electos.</span>
                    </td>
                </tr>
            </tbody>
        </table>`
          }
          return tooltip;
        }
      },
      credits: {
        enabled: false
      },
      exporting: { enabled: false },
      series: this.listaDataRadar,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            pane: {
              size: '70%'
            }
          }
        }]
      }
    };
    this.updateDemo = true;
  }
  exportarPdf() {
    this.highcharts.exportCharts([Highcharts.charts[0], Highcharts.charts[1], Highcharts.charts[2], Highcharts.charts[3], Highcharts.charts[4], Highcharts.charts[5], Highcharts.charts[6]], {
      type: "application/pdf"
    });
  }

}
