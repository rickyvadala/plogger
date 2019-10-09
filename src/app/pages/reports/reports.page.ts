import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { EventoModel } from 'src/app/models/evento.model';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {


  //Estadisticas por edad
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //Estadistica de ciudades  
  view: any[] = [360, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Eventos';
  timeline = true;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  multi: any[];
  //aca termina ciudades 

  eventos: any;
  eventosPorCiudad: any[] = [];
  contCordoba = 0;
  contBsAs = 0;
  mostrarSexo = false;
  usuarios: any[] = [];
  sexoUsuario: any[] = [];


  //Sexo
  contMasculino = 0;
  contFemenino = 0;
  contPlanta = 0;

  // eventos por tipo
  contEventosRunning = 0;
  contEventosRecoleccion = 0;
  contEventosReforestacion = 0;
  contEventosRecursos = 0;
  contEventosReciclaje = 0;
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;

  barChartData: ChartDataSets[] = [];
  mostrarEventosTipo = false;


  constructor(private eventServices: EventService,
    private usuarioPloggerService: UsuarioPloggerService) { }

  ngOnInit() {
    this.eventosPorCiudades();
    this.personasSegunSexo();
    // this.eventosPorTipo();
  }

  // eventosPorTipo() {
  //   this.eventServices.obtenerEventos().subscribe((resp: EventoModel[]) => {
  //     let eventos = resp;

  //     eventos.forEach(evento => {
  //       evento.type.forEach(type => {
  //         let tipo = type;
  //         switch (tipo) {
  //           case 0 :
  //            this.contEventosRecoleccion = this.contEventosRecoleccion + 1;
  //            break;
  //           case 1 :
  //             this.contEventosRunning = this.contEventosRunning + 1;
  //             break;
  //           case 2 :
  //             this.contEventosReforestacion = this.contEventosReforestacion + 1;   
  //             break;
  //           case 3 :
  //             this.contEventosRecursos =  this.contEventosRecursos + 1;
  //             break;
  //           case 4 :
  //             this.contEventosReciclaje = this.contEventosReciclaje + 1;
  //             break;
  //         }
  //       });

  //     });

  //     this.barChartLabels = ['Recolección de basura', 'Running', 'Reforestación', 'Reducción de recursos', 'Reciclaje'];
  //     this.barChartData = [
  //       { data: [this.contEventosRecoleccion, this.contEventosRunning, this.contEventosReforestacion, this.contEventosRecursos, this.contEventosReciclaje], label: 'Eventos',
  //       backgroundColor: 'green' , borderColor: 'green',},
  //     ];
  //     this.mostrarEventosTipo = true;

  //   })
  // }

  personasSegunSexo() {
    this.usuarioPloggerService.obtenerPerfiles().subscribe(resp => {
      this.usuarios = resp;
      this.usuarios.forEach(usuario => {
        this.sexoUsuario.push(usuario.sexo);
      });
      this.sexoUsuario.forEach(us => {
        if (us.includes("p")) {
          this.contPlanta = this.contPlanta + 1;
          return;
        }
        if (us.includes("f")) {
          this.contFemenino = this.contFemenino + 1;
          return;
        }
        if (us.includes("m")) {
          this.contMasculino = this.contMasculino + 1;
          return;
        }
      })

      // Datos 
      this.pieChartLabels = ['Planta', 'Masculino', 'Femenino'];
      this.pieChartData = [this.contPlanta, this.contMasculino, this.contFemenino];
      this.mostrarSexo = true;
    })
  }




  eventosPorCiudades() {
    this.eventServices.obtenerEventos().subscribe(resp => {
      this.eventos = resp;
      this.eventos.forEach(evento => {
        this.eventosPorCiudad.push(evento.ubication);
      });

      this.eventosPorCiudad.forEach(element => {
        if (element.includes("ciudad de cordoba") || element.includes("ciudad de córdoba") || element.includes("Ciudad de Cordoba") || element.includes("CIUDAD DE CORDOBA")) {
          this.contCordoba = this.contCordoba + 1;
          return;
        }
        if (element.includes("buenos aires") || element.includes("Buenos Aires") || element.includes("Buenos aires") || element.includes("BUENOS AIRES")) {
          this.contBsAs = this.contBsAs + 1;
          return;
        }
      });

      //Datos de la estadistica 
      this.multi = [
        {
          name: 'Ciudad',
          series: [
            {
              name: 'Cordoba',
              value: this.contCordoba
            },
            {
              name: 'Buenos Aires',
              value: this.contBsAs
            }
          ]
        }
      ];
    });
  }





}
