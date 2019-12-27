import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { EventoModel } from 'src/app/models/evento.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PopoverController, AlertController, ModalController, PickerController } from '@ionic/angular';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { PublicacionModel } from 'src/app/models/publicacion.model';
import { PopPublicacionesReportComponent } from '../pop-publicaciones-report/pop-publicaciones-report.component';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { SearchTypeEventService } from 'src/app/services/search-type-event.service';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss'],
})
export class EventoComponent implements OnInit {

  eventos : any [] = [];
  private subscripcion: Subscription;

  misEventos: string;
  usuario:PerfilUsuarioModel={};
  popClick: string;

  eventsReady = false;

  defaultColumnOptions = [
    [
      'Desnudos o actividad sexual',
      'Lenguajes que incitan al odio',
      'Violencia u organizaciones peligrosas',
      'Bullying o acoso',
      'Informacion falsa'
    ]
  ]
   multiColumnOptions = [
    
  ]


  constructor(private eventService: EventService,
              public router: Router,
              private dataShare: DataShareService,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private pickerController: PickerController               ) {
   }

  ngOnInit() {
    this.dataShare.currentMessage.subscribe( mensaje => this.popClick = mensaje);
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });
    //this.cargarEventos();
  }

  ionViewWillEnter() {
    // this.cargarEventos();
  }

  cargarEventos() {
  this.subscripcion =  this.eventService.obtenerEventos()
    .subscribe(respuesta => {
      this.eventos = respuesta;
    })
  }

  eventosFinalizados(){
    this.eventService.obtenerEventosFinalizados().subscribe(resp => {
      this.eventos = resp;
      this.eventos.forEach(evento => {
        evento.orderDate = new Date(evento.startDate);
      });
      this.eventos = this.eventos.sort((a,b) => a.orderDate- b.orderDate);
   });
  }


  eventosEnProceso() {
    this.eventService.obtenerEventosEnProceso().subscribe(resp => {
      this.eventos = resp;
      this.eventos.forEach(evento => {
        evento.orderDate = new Date(evento.startDate);
      });
      this.eventos = this.eventos.sort((a,b) => a.orderDate- b.orderDate);
     });
  }

  obtenerMisEventos(){
   this.eventService.obtenerMisEventos().subscribe(resp => {
      this.eventos = resp;
      this.eventos.forEach(evento => {
        evento.orderDate = new Date(evento.startDate);
      });
      this.eventos = this.eventos.sort((a,b) => a.orderDate- b.orderDate);
    });
  }

  eventosFiltrados() {
    let fechaDesde;
    let fechaHasta;
    let ciudad;
    this.eventsReady = true;

    if(this.eventService.filterFechaDesde) {
      fechaDesde = new Date(this.eventService.filterFechaDesde);
    }
    if(this.eventService.filterFechaHasta){
      fechaHasta = new Date(this.eventService.filterFechaHasta);
    }

    if(this.eventService.filterCiudad){
      ciudad = this.eventService.filterCiudad;
    }

    this.eventService.obtenerEventos().subscribe(response => {

      this.eventos = response;  
      if(fechaDesde) {
        this.eventos = this.eventos.filter(e => new Date(e.startDate) > fechaDesde);
      }
      if(fechaHasta) {
        this.eventos = this.eventos.filter(e => new Date(e.endDate) < fechaHasta);
      }

      if (ciudad) {
        this.eventos = this.eventos.filter(e => e.ubication.includes(ciudad));
      }

      this.eventsReady = false;

    })
  }

  doRefresh( event){
    event.target.complete();
  }

  goToEvent(i) {
    let eid = this.eventos[i].id;
    this.router.navigate([`/event/${eid}`],  {state:  this.eventos[i]} );
    // this.router.navigate(['/event', eid],).then();
  }

  obtenerEventosPorTipo(idTipo) {
    this.eventService.obtenerEventos().subscribe((eventos: EventoModel [] ) => {
      for (let i = 0; i < eventos.length; i++) {
        const eventosFiltrados = eventos[i];
       for (let j = 0; j < eventos[i].type.length; j++) {
         const tipo = eventos[i].type[j];
         if (tipo == idTipo) {
          this.eventos.push(eventosFiltrados);
         }  
       }
      }
      });    
  }

  obtenerEventoCompartir(evento: any) {
    this.eventos.push(evento);
  }

  mostrarEventoPublicacion(evento: any) {
    this.eventos.push(evento);
  }

  getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

   getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }

    return options;
  }

  async mostrarPopReport(evento,i, event) {
    const popover = await this.popoverCtrl.create({
      component: PopPublicacionesReportComponent,
      event: evento,
      mode: 'ios',
      componentProps: {
        publicacion: event
      }
    });
    await popover.present();
    popover.onDidDismiss().then( resp => {
 
      if (this.popClick=== "reportar") {    
        this.openPicker(i,event);
       }
       
    });
  }
  
  async openPicker(i, event,numColumns = 1, numOptions = 5, columnOptions = this.defaultColumnOptions){
    const picker = await this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),  
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (motivo) => {
          this.reportAlert(i,event, motivo);
          }
        }
      ]
    });
    await picker.present();
  }

  async reportAlert(i,event, motivo) {
    const alert = await this.alertCtrl.create({
      //header: 'Gracias por reportar esta publicación',
       subHeader: 'Gracias por reportar este evento',
      message: 'Si crees que este evento infringe nuestras normas y políticas de seguridad, márcalo como inapropiado',
      buttons: [{
        text: 'Cancelar',
        handler: (blah) => {
          return;
        }
      },
        {
          text: 'Inapropiado',
          handler: (blah) => {
         
            let personaQueReporta = this.usuario.nombre + ' ' + this.usuario.apellido;
            this.eventService.motivoReporte(event,motivo);
            this.eventService.report(event,personaQueReporta).subscribe(resp => {
              if (this.usuario.reportados===undefined) {
               // this.usuario.reportados=[pidPublicacion]; 
              
                this.eventService.borrarEvento(event.id).subscribe();
                this.eventos.splice(i,1);
              }else {
                  //  this.usuario.reportados.unshift(pidPublicacion); 
                this.eventService.borrarEvento(event.id).subscribe();
                this.eventos.splice(i,1);
              }
              return;
            });
            return;
          }
        }
      ]
    });
      await alert.present();
    
  }
}
