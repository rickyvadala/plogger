import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopEventoSettingsComponent } from 'src/app/components/pop-evento-settings/pop-evento-settings.component';
import { DataShareService } from '../../services/data-share.service';
import { EventService } from '../../services/event.service';

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
  typeDescripcion: string []= [];
  usuarioUid: any;

  miEvento = false;


  popClick: string;
  map: GoogleMap;

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
              ) {
  

    this.dataShare.currentUser.subscribe( usuario => this.usuarioUid = usuario.uid );
    this.dataShare.currentMessage.subscribe(mensaje => this.popClick = mensaje);

    this.obtenerEvento();     

     if(this.uid === this.usuarioUid) {
       this.miEvento = true;
     }
   }

   obtenerEvento() {
    this.evento = this.router.getCurrentNavigation().extras.state;
    this.eid = this.evento.id;
    this.name =  this.evento.name;
    this.description = this.evento.description;
    this.inicio = this.evento.startDate;
    this.fin = this.evento.endDate;
    this.location = this.evento.ubication;
    this.foto = this.evento.foto;
    this.uid = this.evento.uid;
    this.recorridoDesde = this.evento.recorridoDesde;
    this.recorridoHasta = this.evento.recorridoHasta;
    this.type = this.evento.type;
    this.type.forEach(tipo => {
     
      this.eventService.obtenerDescripcionTipoEventos(tipo)
      .subscribe((resp: any) => { 
        this.typeDescripcion.push(resp.label);
      
      });
    });
   
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


}
