import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EventoModel } from 'src/app/models/evento.model';
import { EventService } from 'src/app/services/event.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { AlertController } from '@ionic/angular';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { storage } from 'firebase';


@Component({
  selector: 'app-modal-event',
  templateUrl: './modal-event.page.html',
  styleUrls: ['./modal-event.page.scss'],
})
export class ModalEventPage implements OnInit {

   event: EventoModel = {
    name: '',
    description: '',
    ubication: '',
    startDate: '',
    endDate: ''
  }

  usuario: PerfilUsuarioModel = {};
  options: ImagePickerOptions;
  imageResponse: any;
  imageURL: string;
  nombreImg: string;
  hayFoto= false;
  imagStorage: string;
  fechasInvalidas = true;

  editar = false;
  
  eventEditar: any;
  constructor(private router: Router,
              private eventServices: EventService,
              private dataShare: DataShareService,
              private alertCtrl: AlertController,
              public imagePicker: ImagePicker,
              public file: File) { 

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
    this.event.ubication = this.eventEditar.ubication;
    this.event.uid = this.eventEditar.uid;
  }
  
  }

  ngOnInit() {
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
      this.event.ubication= form.value.ubication,
      this.event.startDate= form.value.startDate,
      this.event.endDate= form.value.endDate,
      //Usuario que crea el evento
      this.event.uid = this.usuario.uid;
      this.event.foto = this.imageURL;
  
     if( this.validarFechas(this.event.endDate, this.event.startDate)){
      this.eventServices.guardarEvento(this.event)
      .subscribe(resp => {
        console.log(resp);
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

      console.log('imageUrl');
      console.log(this.imageURL);

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

}