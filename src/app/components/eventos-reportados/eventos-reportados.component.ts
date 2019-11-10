import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-eventos-reportados',
  templateUrl: './eventos-reportados.component.html',
  styleUrls: ['./eventos-reportados.component.scss'],
})
export class EventosReportadosComponent implements OnInit {

  eventos : any [] = [];  
  private suscripcion: Subscription;


  constructor( public router: Router,
              private eventService: EventService,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.cargarPublicacionesReportadas();
  }

  cargarPublicacionesReportadas(){
    this.suscripcion=this.eventService.obtenerEventosReportados()
    .subscribe(resp => {
      this.eventos = resp; 
      }  
    );  
  }

  goToEvent(i) {
    let eid = this.eventos[i].id;
    this.router.navigate([`/event/${eid}`],  {state:  this.eventos[i]} );
    // this.router.navigate(['/event', eid],).then();
  }


  aceptarReporte(i,event){
    this.eventService.borrarEventoReportado(event.id).subscribe();
   
    this.eventoReportadoEliminado(i);
  
  }

  cancelarReporte(i,event){
    this.eventService.guardarEvento(event).subscribe(resp =>{
      
     this.eventService.borrarEventoReportado(event.id).subscribe();
     this.eventoReportadoCancelado(i,event);
      return;

    });
  }

  async eventoReportadoEliminado(i) {
    const alert = await this.alertCtrl.create({
      //header: 'Gracias por reportar esta publicación',
       subHeader: 'Evento eliminado',
      message: '',
      buttons: [{
        text: 'Ok',
        handler: (blah) => {
          this.eventos.splice(i,1);
          
          return;
        }
      }
      ]
    });
      await alert.present();
    
  }

  async eventoReportadoCancelado(i,event) {
    const alert = await this.alertCtrl.create({
      //header: 'Gracias por reportar esta publicación',
       subHeader: 'Cancelar evento reportado',
      message: 'El evento "'+ event.name +'" cumple con nuestros terminos y condiciones',
      buttons: [{
        text: 'Ok',
        handler: (blah) => {
          this.eventos.splice(i,1);
          return;
        }
      }
      ]
    });
      await alert.present();
    
  }
}
