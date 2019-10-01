import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopEventoSettingsComponent } from 'src/app/components/pop-evento-settings/pop-evento-settings.component';
import { DataShareService } from '../../services/data-share.service';
import { EventService } from '../../services/event.service';
import { UsuarioPloggerService } from '../../services/usuario-plogger.service';
import { PerfilUsuarioModel } from '../../models/perfil-usuario.model';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

declare var google;

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  evento: any;
  eid: string;
  name: string;
  description: string;
  inicio: string;
  fin: string;
  foto: string;
  location: string;
  uid: string;
  recorridoDesde: string;
  recorridoHasta: string;
  type: string []= [];
  typeDescripcion: any []= [];
  usuariosAsistire: any [] = [];
  usuarioUid: any;

  miEvento = false;


  popClick: string;
  map: GoogleMap;

  usuario: PerfilUsuarioModel;
  meInteresaFlag = false;
  asistireFlag = false;

  cantAsistire: number = 0;
  eventoAsistire: any [] = [];  

   //Esto es de googleMaps
   @ViewChild('mapElement') mapNativeElement: ElementRef;
   directionsService = new google.maps.DirectionsService;
   directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(private popoverCtrl: PopoverController, 
              public route: ActivatedRoute,
              public router: Router, 
              private dataShare: DataShareService,
              private eventService: EventService,
              public alertCtrl: AlertController,
              public usuarioService: UsuarioPloggerService
              ) {
  
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario;
      this.usuarioUid = usuario.uid;
    } );
    this.dataShare.currentMessage.subscribe(mensaje => this.popClick = mensaje);

    this.obtenerEvento();     

   }

   obtenerEvento() {
    this.evento = this.router.getCurrentNavigation().extras.state;
    this.eid = this.evento.id;
    this.eventService.obtenerEvento(this.eid).subscribe((resp: any) => {

      this.name =  resp.name;
      this.description = resp.description;
      this.inicio = resp.startDate;
      this.fin = resp.endDate;
      this.location = resp.ubication;
      this.foto = resp.foto;
      this.uid = resp.uid;
      this.recorridoDesde = resp.recorridoDesde;
      this.recorridoHasta = resp.recorridoHasta;
      this.type = resp.type;
      this.eventoAsistire = resp.asistire;
      if(this.uid === this.usuarioUid) {
        this.miEvento = true;
      }
      if(this.usuario.eventosMeInteresa || (this.usuario.eventosMeInteresa !== undefined)) {
        this.usuario.eventosMeInteresa.forEach(event => {
          if(event == this.eid){
            this.meInteresaFlag = true;
          }
        });
      }
      if(this.eventoAsistire) {
        let asistire = this.eventoAsistire;
        asistire.forEach(a => {
          this.cantAsistire = this.cantAsistire + 1;
          if(this.usuario.key === a) {
            this.asistireFlag = true;
            return;
          }
        });
      }

      this.type.forEach(tipo => {
     
      this.eventService.obtenerDescripcionTipoEventos(tipo)
      .subscribe((resp: any) => { 
        this.typeDescripcion.push(resp);
      
      });
    });
    })
   
   }

  ngOnInit() {
    this.mostrarMapa();
  }

  async mostrarPop(event) {
    const popover = await this.popoverCtrl.create({
      component: PopEventoSettingsComponent,
      event: event,
      mode: 'ios'
    });
    await popover.present();
    popover.onDidDismiss().then( resp => {
     if (this.popClick==="borrar") {
      this.eventService.borrarEvento(this.eid).subscribe( resp => {
        if (resp == null) {
          this.eventoBorrado();
        }
      });  
     }
     if (this.popClick==="editar") {

      this.router.navigate(['/event'],  {state:  this.evento} );      
     }
    });
  }

  async eventoBorrado() {
    const alert = await this.alertCtrl.create({
      header: 'Evento borrado',
      buttons: [
        {
          text: 'Ok',
          handler: (blah) => {
            this.router.navigate(['/tabs/events']);

          }
        }
      ]
    });
    await alert.present();
  }

  doRefresh(event) {
      this.obtenerEvento();
      event.target.complete();
  }


  ngAfterViewInit(): void {
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 7,
      center: {lat: -31.4134998, lng: -64.1810532}
    });
    this.directionsDisplay.setMap(map);
  }

  mostrarMapa() {
    const that = this;
    this.directionsService.route({
      origin: this.recorridoDesde,
      destination: this.recorridoHasta,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Dirección no existente, por favor intente nuevamente.');
      }
    });
  }

  meInteresa() {
    let eid = this.evento.id;
    if(!this.meInteresaFlag) {
      this.usuarioService.agregarEventosMeInteresa(eid).subscribe(() => {
        if(!(this.usuario.eventosMeInteresa !== undefined)) {
          this.usuario.eventosMeInteresa = [];
        }
        this.meInteresaFlag = true;
        this.usuario.eventosMeInteresa.push(eid);
        this.dataShare.changeUser(this.usuario);
      });
      
    } else {
      this.usuarioService.eliminarEventoMeInteresa(eid).subscribe(() => {
        this.meInteresaFlag = false;
        if(this.usuario.eventosMeInteresa !== undefined){
          for (let index = 0; index <this.usuario.eventosMeInteresa.length; index++) {
            const evento = this.usuario.eventosMeInteresa[index];
            if (evento == eid) {
              this.usuario.eventosMeInteresa.splice(index, 1);
            }
          }
        }
      })
    }
  }

  asistire() {
    let eid = this.evento.id;
    if(!this.asistireFlag) {
      this.eventService.agregarAsistire(eid).subscribe();
      this.asistireFlag = true;
      this.cantAsistire = this.cantAsistire + 1;
      this.eventoAsistire.push(this.usuario.key);
    } else {
      this.eventService.eliminarAsistire(eid).subscribe();
      for (let i = 0; i < this.eventoAsistire.length; i++) {
        const asistire = this.eventoAsistire[i];
        if( asistire == this.usuario.key) {
          this.eventoAsistire.splice(i , 1);
        }
      }
      this.asistireFlag = false;
      this.cantAsistire = this.cantAsistire - 1;
    }
  }

  shareEvent() {
    this.router.navigate(['/compartir-evento'], {state: this.evento});
  }

  verAsistire() {
    this.router.navigate(['/asistiran'], {state: this.eventoAsistire});
  }

  invitarAmigos() {
    this.router.navigate(['/invitar-amigos', this.eid] );
  }

}
