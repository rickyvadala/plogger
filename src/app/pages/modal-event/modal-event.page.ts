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
    starTime: '',
    endDate: '',
    endTime: ''
  }

  usuario: PerfilUsuarioModel = {};
  options: ImagePickerOptions;
  imageResponse: any;
  imageURL: string;
  nombreImg: string;
  hayFoto= false;
  imagStorage: string;



  constructor(private router: Router,
              private eventServices: EventService,
              private dataShare: DataShareService,
              private alertCtrl: AlertController,
              public imagePicker: ImagePicker,
              public file: File) { 

  this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario)
  }

  ngOnInit() {
    console.log('usuario ',this.usuario);

  }
  
  onSubmitTemplate(form: NgForm) {
    console.log(form.value);
    // const event: EventoModel = {
    //   name: form.value.name,
    //   description: form.value.description,
    //   ubication: form.value.ubication,
    //   startDate: form.value.startDate,
    //   endDate: form.value.endDate,
    //   starTime: form.value.starTime,
    //   endTime: form.value.endTime
    // }
    this.event.name = form.value.name;
    this.event.description= form.value.description,
    this.event.ubication= form.value.ubication,
    this.event.startDate= form.value.startDate,
    this.event.endDate= form.value.endDate,
    this.event.starTime= form.value.starTime,
    this.event.endTime= form.value.endTime
    //Usuario que crea el evento
    this.event.uid = this.usuario.uid;
    this.event.foto = this.imageURL;

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
          handler: (blah) => {console.log('Button ok');}
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
          handler: (blah) => {console.log('Button ok');}
        }
      ]
    });
    await alert.present();
  }

}
