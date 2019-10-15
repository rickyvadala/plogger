import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { EventoModel } from 'src/app/models/evento.model';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } from 'ng2-charts';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { EventTypePageModule } from '../event-type/event-type.module';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  //Estadisticas semanas 
  eventosMesReady = false;
  public lineChartData: ChartDataSets[] = [];
 
  public lineChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public pieChartOptions2: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  //Estadisticas por edad
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //Estadisticas eventos finalizados 
  public pieChartOptionsEventosFinal: ChartOptions = {
    responsive: true
  };
  public pieChartLabelsEventosFinal: Label[] = [];
  public pieChartDataEventosFinal: SingleDataSet = [];
  public pieChartTypeEventosFinal: ChartType = 'pie';
  public pieChartLegendEventosFinal = true;
  public pieChartPluginsEventosFinal = [];

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
  mostrarEventosFinalizados = false;
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

  //Creadores de eventos
  contEventoFinalizado =0;
  contEventoEnProceso =0;


  constructor(private eventServices: EventService,
    private usuarioPloggerService: UsuarioPloggerService) { 
      monkeyPatchChartJsTooltip();
      monkeyPatchChartJsLegend();
    }

  ngOnInit() {
    this.eventosPorCiudades();
    this.personasSegunSexo();
    this.eventosPorTipo();
    this.usuariosPorEventoCreado();
    this.eventosPorDias();
  }

eventosPorDias() {
  this.eventServices.obtenerEventos().subscribe(resp => {
    let eventos= resp;
    let eventosEnero;
    let eventosFebrero;
    let eventosMarzo;
    let eventosAbril;
    let eventosMayo;
    let eventosJunio;
    let eventosJulio;
    let eventosAgosto;
    let eventosSeptiembre;
    let eventosOctubre;
    let eventosNoviembre;
    let eventosDiciembre;
    eventosEnero = eventos.filter(e => e.startDate.includes('-01-')).length;
    eventosFebrero = eventos.filter(e => e.startDate.includes('-02-')).length;
    eventosMarzo = eventos.filter(e => e.startDate.includes('-03-')).length;
    eventosAbril = eventos.filter(e => e.startDate.includes('-04-')).length;
    eventosMayo = eventos.filter(e => e.startDate.includes('-05-')).length;
    eventosJunio = eventos.filter(e => e.startDate.includes('-06-')).length;
    eventosJulio = eventos.filter(e => e.startDate.includes('-07-')).length;
    eventosAgosto = eventos.filter(e => e.startDate.includes('-08-')).length;
    eventosSeptiembre = eventos.filter(e => e.startDate.includes('-09-')).length;
    eventosOctubre = eventos.filter(e => e.startDate.includes('-10-')).length;
    eventosNoviembre = eventos.filter(e => e.startDate.includes('-11-')).length;
    eventosDiciembre = eventos.filter(e => e.startDate.includes('-12-')).length;

  this.lineChartData = [
      { data: [eventosEnero, eventosFebrero, eventosMarzo, eventosAbril, eventosMayo, eventosJunio, eventosJulio,
        eventosAgosto,eventosSeptiembre,eventosOctubre, eventosNoviembre,eventosDiciembre], label: 'Eventos' },
    ];

    this.eventosMesReady = true;
  })
}

  eventosPorTipo() {
    this.eventServices.obtenerEventos().subscribe((resp: EventoModel[]) => {
      let eventos = resp;
   
      eventos.forEach(evento => {
        evento.type.forEach(type => {
          let tipo = type;
          switch (tipo) {
            case 0 :
             this.contEventosRecoleccion = this.contEventosRecoleccion + 1;
             break;
            case 1 :
              this.contEventosRunning = this.contEventosRunning + 1;
              break;
            case 2 :
              this.contEventosReforestacion = this.contEventosReforestacion + 1;   
              break;
            case 3 :
              this.contEventosRecursos =  this.contEventosRecursos + 1;
              break;
            case 4 :
              this.contEventosReciclaje = this.contEventosReciclaje + 1;
              break;
          }
        });

      });

      this.barChartLabels = ['Recolección de basura', 'Running', 'Reforestación', 'Reducción de recursos', 'Reciclaje'];
      this.barChartData = [
        { data: [this.contEventosRecoleccion, this.contEventosRunning, this.contEventosReforestacion, this.contEventosRecursos, this.contEventosReciclaje], label: 'Eventos',
        backgroundColor: 'pink' , borderColor: 'pink',},
      ];
      this.mostrarEventosTipo = true;

    })
  }

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


  usuariosPorEventoCreado() {
    let fechaActual = new Date; 
    this.eventServices.obtenerEventos().subscribe(resp => {
      this.eventos = resp; 
      this.eventos.forEach(evento => {
     let fechaFinEvento = evento.endDate;
        if (fechaFinEvento< fechaActual.toISOString()){
          this.contEventoFinalizado = this.contEventoFinalizado + 1;
        }else {
          this.contEventoEnProceso = this.contEventoEnProceso + 1;
        }
      });
      // Datos 
      this.pieChartLabelsEventosFinal = ['Eventos finalizados', 'Eventos en proceso'];
      this.pieChartDataEventosFinal = [this.contEventoFinalizado, this.contEventoEnProceso];
      this.mostrarEventosFinalizados = true;
    })

  }
}
