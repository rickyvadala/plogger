import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { NgForm } from '@angular/forms';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { storage } from 'firebase';
import { DataShareService } from 'src/app/services/data-share.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { PublicacionComponent } from 'src/app/components/publicacion/publicacion.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  usuario: PerfilUsuarioModel = {};

  images: any[];
  imageURL: string;
  nombreImg: string;

  imagStorage: string;
  
  imageResponse: any;
  options: ImagePickerOptions;

  hayFoto = false;
  mostrarTipoPersona = false;
  publicaciones:any[]=[];
  publicacionesAll:any[]=[];
  cantPosts:Number;


  private suscripcion: Subscription;

  @ViewChild('publicacion') publicacion: PublicacionComponent;


  constructor(private authPlogger: UsuarioPloggerService, 
              private alertCtrl: AlertController,
              private router: Router,
              public imagePicker: ImagePicker,
              public file: File,
              private dataShare: DataShareService,
              public publicacionesService:PublicacionesService
              ) { }

  ngOnInit() {
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
    console.log(this.usuario);
    this.mostrarSegunTipoUsuario();

  
    
  }

  volver() {
    this.router.navigate(['/tabs/home']);
  }

    cambioFecha(event) {
    console.log('Date', new Date(event.detail.value));
  }

  onSubmitTemplate(form: NgForm) {
 
    //Creo el usuario que va a pisar la base de datos
    const usuario: PerfilUsuarioModel = {
      apellido: form.value.apellido,
      fechaNac: form.value.fecha,
      //foto: this.imageURL,
      nombre: form.value.nombre,
      sexo: form.value.sexo,
      tipoInicio: this.usuario.tipoInicio,
      uid: this.usuario.uid,
      mail:this.usuario.mail,
      seguidores: this.usuario.seguidores,
      seguidos: this.usuario.seguidos,
      eventosMeInteresa: this.usuario.eventosMeInteresa,
      tipoUsuario: this.usuario.tipoUsuario,
      descripcion: this.usuario.descripcion,
      admin: false
    }
    // Solucion de que se borra la foto actual si no subis una
    if (this.imageURL===undefined) {
      usuario.foto=this.usuario.foto;
    } else {
      usuario.foto=this.imageURL;
      this.usuario.foto = this.imageURL;
    }   

    //Llamo al metodo que hace el PUT y le mando el usuario
    this.authPlogger.editarUsuario( usuario );

    this.usuario.apellido = form.value.apellido;
    this.usuario.nombre = form.value.nombre;
    this.usuario.fechaNac = form.value.fecha;
    this.usuario.sexo = form.value.sexo;

  
    this.actualizarPublicaciones();

    this.dataShare.changeUser(this.usuario);
    
    this.volver();
  }

  async cambiarContrasena() {
    const mail = this.usuario.mail;
    console.log(mail);
    return await this.authPlogger.sendPasswordResetEmail(mail).then(resp => {
      console.log(resp);
      this.emailEnviado();
  });
}

  async emailEnviado() {

    const alert = await this.alertCtrl.create({
    header: 'Email enviado',
    // subHeader: 'Subtitle',
    message: 'Se ha enviado un email de reestablecimiento de contraseña',
    buttons: [
      {
        text: 'Ok',
        handler: (blah) => {
          return;
        }
      }
    ],
  });
    await alert.present();
    }



  subirFotoPerfil() {
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

  mostrarSegunTipoUsuario(){
    if (this.usuario.tipoUsuario === 'persona') {
      this.mostrarTipoPersona = true;
    }
  }

  actualizarPublicaciones(){
    let UID = this.usuario.uid;
    this.publicacionesService.obtenerPublicacionesPerfil(this.usuario.uid).subscribe(resp => {
      if(this.usuario.uid = this.usuario.key) {
        resp.forEach(publicacion => {
           publicacion.nombre = this.usuario.nombre;
           publicacion.apellido = this.usuario.apellido;
           publicacion.fotoPerfil = this.usuario.foto;
          // //de aca hay q llamar las publicaciones para q actualice..
           this.publicacionesAll = resp;
           this.publicaciones.push(...this.publicacionesAll.splice(0,5)); 
          this.publicaciones.forEach(element => {
            element.nombre = this.usuario.nombre;
            element.apellido = this.usuario.apellido;
            element.fotoPerfil = this.usuario.foto;
            this.publicacionesService.publicaciones.push(element);
          });
           this.publicacionesService.cambioNombre = true;     
        });
      } else { console.log('else');}
    });

  }

  
}
