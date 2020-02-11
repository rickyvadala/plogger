import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EventoModel } from 'src/app/models/evento.model';
import { EventService } from 'src/app/services/event.service';
import { TypeEventService } from 'src/app/services/type-event.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { AlertController } from '@ionic/angular';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { storage } from 'firebase';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
//Google Maps
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { GoogleMap } from '@ionic-native/google-maps';
import { FLAGS } from '@angular/core/src/render3/interfaces/view';


declare var google;


@Component({
  selector: 'app-modal-event',
  templateUrl: './modal-event.page.html',
  styleUrls: ['./modal-event.page.scss'],
})
export class ModalEventPage implements OnInit, AfterViewInit {

  //Esto es de googleMaps recorrido
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;

  //Google maps Geolocali
  @ViewChild('mapElement') mapNativeElementGeo: ElementRef;
  directionsServiceGeo = new google.maps.DirectionsService;
  directionsDisplayGeo = new google.maps.DirectionsRenderer;
  directionFormGeo: FormGroup;
  currentLocation: any = {
    lat: 0,
    lng: 0
  };

   event: EventoModel = {
    name: '',
    type: [],
    description: '',
    ubication: '',
    startDate: '',
    endDate: ''
  }


  selectedType: any[] = [];

  usuario: PerfilUsuarioModel = {};
  options: ImagePickerOptions;
  imageResponse: any;
  imageURL: string;
  nombreImg: string;
  hayFoto= false;
  imagStorage: string;
  fechasInvalidas = true;
  selecTipoEvento = false;
  hayDireccion = false;

  editar = false;
  showMap = false;

  public selected: string[] = [];
  
  tipoEvento:  number[] = [];
  recorrido = false; 

  
  eventEditar: any;
  constructor(private router: Router,
              private eventServices: EventService,
              private dataShare: DataShareService,
              private alertCtrl: AlertController,
              public imagePicker: ImagePicker,
              public file: File,
              private fb: FormBuilder,
              private geolocation: Geolocation,
              public typeEventService: TypeEventService ) { 
  
  
  this.createDirectionForm();
  this.crearDireccionEvento();

  this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
  this.eventEditar = this.router.getCurrentNavigation().extras.state;

  if (this.eventEditar){
    this.editar = true;
    this.event.id = this.eventEditar.id;
    this.event.name = this.eventEditar.name;
    this.event.description = this.eventEditar.description;
    this.event.startDate = this.eventEditar.startDate;
    this.event.endDate = this.eventEditar.endDate;
    this.event.foto = this.eventEditar.foto;
    if( this.event.foto) {
      this.imageResponse = this.eventEditar.foto;
      this.hayFoto = true;
    }
    
    
    this.event.ubication = this.eventEditar.ubication;
    this.event.uid = this.eventEditar.uid;
  }
  
  }

  map: GoogleMap;

  ngOnInit() {

  }

  desactivarBoton (param) {
    let flag = true;
    if (param && this.selecTipoEvento && this.hayDireccion) {
      flag = false
    }
    return flag;
  }

//recorrido
  createDirectionForm() {
    this.directionForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required]
    });
  
  }

  ngAfterViewInit(): void {

    //recorrido
    const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 7,
      center: {lat: -31.4134998, lng: -64.1810532}
    });
    this.directionsDisplay.setMap(map);

    //geolocaliza
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLocation.lat = resp.coords.latitude;
      this.currentLocation.lng = resp.coords.longitude;
    });
    const mapGeo = new google.maps.Map(this.mapNativeElementGeo.nativeElement, {
      zoom: 7,
      center: {lat: -31.4134998, lng: -64.1810532}
    });
    this.directionsDisplayGeo.setMap(mapGeo);
  }

  //recorrido
  calculateAndDisplayRoute(formValues) {
    const that = this;
    this.directionsServiceGeo.route({
      origin: formValues.source,
      destination: formValues.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplayGeo.setDirections(response);
        this.showMap = true;
      } else {
        window.alert('Dirección no existente, por favor intente nuevamente.');
      }
    });
  }
//ubicacion evento
  crearDireccionEvento () {
    this.directionFormGeo = this.fb.group({
      destination: ['', Validators.required]
    });
  }
//ubicacion evento
  obtenerDireccionEvento (formValuesGeo) {
    const that = this;
    this.directionsService.route({
      origin: formValuesGeo.destination,
      destination: formValuesGeo.destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.directionsDisplayGeo.setDirections(response);
        this.showMap = true;
      } else {
        window.alert('Dirección no encontrada, ingrese nuevamente.'); //+ status);
      }
    });

  }

habilitarDireccion(){
  this.hayDireccion = true;

}
  
  onSubmitTemplate(form: NgForm) {

    if(this.editar) {
      this.eventServices.editarEvento(this.event).subscribe(resp => {
        if(resp !== null) {
            this.eventoEditadoAlert();
        }
      });

    } else {
      
      this.event.name = form.value.name;
      this.event.description= form.value.description,
      this.event.ubication= this.directionFormGeo.value.destination,
      this.event.startDate= form.value.startDate,
      this.event.endDate= form.value.endDate,
      //Usuario que crea el evento
      this.event.uid = this.usuario.uid;
      this.event.foto = this.imageURL;
      this.event.recorridoDesde = this.directionForm.value.source;
      this.event.recorridoHasta = this.directionForm.value.destination;
      this.event.type = this.tipoEvento;
  
     if( this.validarFechas(this.event.endDate, this.event.startDate)){
      this.eventServices.guardarEvento(this.event)
      .subscribe(resp => {
        if (resp !== null) {
          this.eventoCreadoAlert();
          this.volver();
        } else {
          this.errorCrearEventoAlert();
        }
      });
  
     } else {
       return;
     }

    } 

  }


  volver() {
  this.router.navigate(['/tabs/events']);
  // todos los campos vacios
  this.event.name = '';
      this.event.description= '',
      this.event.ubication= '',
      this.event.startDate= '',
      this.event.endDate= '',
      //Usuario que crea el evento
      this.event.uid = '',
      this.event.foto = '',
      this.event.recorridoDesde = '',
      this.event.recorridoHasta = '',
      this.event.type = null;
  }

  subirFotoEvento() {
    this.options = {
    
      width: 200,
      quality: 25,
      outputType: 1,
      maximumImagesCount: 1

    };
    this.imageResponse = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
      
      this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
      this.imageURL = this.imageResponse[i];
      this.hayFoto = true;
      }

      let rnd = ( Math.random() * (9999999999)).toString();
      let img = 'pictures/perfil/foto' + rnd  ;
      this.nombreImg = img;

      const pictures = storage().ref(img);
      pictures.putString(this.imageURL, 'data_url');

    }, (err) => {
      alert(err);
    }); 
  }
  
  async errorCrearEventoAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error al crear evento',
      message: 'Disculpe las molestias, vuelta a intentarlo',
      buttons: [
        {
          text: 'Continuar',
          handler: (blah) => {}
        }
      ]
    });
    await alert.present();
  }

  async eventoCreadoAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Evento creado',
      message: 'Juntos podemos salvar el planeta!',
      buttons: [
        {
          text: 'Ok',
          handler: (blah) => { }
        }
      ]
    });
    await alert.present();
  }

  async fechaInvalidaAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Fecha Inválida',
      message: 'La fecha de finalización debe ser posterior a la fecha de inicio del evento',
      buttons: [
        {
          text: 'Ok',
          handler: (blah) => {}
        }
      ]
    });
    await alert.present();
  }

  validarFechas(endDate, startDate) {
    let inicio = new Date(startDate);
    let fin = new Date(endDate);
    if (fin < inicio) {
      this.fechaInvalidaAlert();
      return false;
    } else {
      return true;
    }
  }

  async eventoEditadoAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Evento editado con éxito!',
      buttons: [
        {
          text: 'Ok',
          handler: (blah) => {
            // this.router.navigate([`/event/${this.event.id}`], {state:  this.event});
            this.router.navigate(['/tabs/events']);
            
          }
        }
      ]
    });
    await alert.present();
  }

  //Tipo de evento seleccionado
  itemSelected (event) {
  this.tipoEvento.push(event.id);
  this.selecTipoEvento = true;
  // this.selectedType.push(event);
  // console.log('selected');
  // console.log(this.selectedType);
  // console.log('tipoEvento');
  // console.log(this.tipoEvento);
  // this.event.type = null;
  
  for (let i = 0; i < this.tipoEvento.length; i++) {
    const element = this.tipoEvento[i];
    if (this.tipoEvento[i] === 0 || this.tipoEvento[i] === 1 || this.tipoEvento[i] === 2) {
      this.recorrido = true;
    }
  }
  }


}
