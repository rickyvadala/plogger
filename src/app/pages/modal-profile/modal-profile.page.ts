import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { NgForm } from '@angular/forms';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.page.html',
  styleUrls: ['./modal-profile.page.scss'],
})
export class ModalProfilePage implements OnInit {

  sexo: string = 'p';
  foto: string = 'none';

  usuario: PerfilUsuarioModel = {
    uid: this.cookies.get('UID'),
    nombre: this.cookies.get('Nombre'),
    apellido: this.cookies.get('Apellido'),
    fechaNac: this.cookies.get('FechaNac'),
    sexo: this.sexo,
    foto: this.foto,
    tipoInicio: this.cookies.get('TipoInicio')
  };


  constructor(private modalCtrl: ModalController, 
              private authPlogger: UsuarioPloggerService, 
              private alertCtrl: AlertController,
              private cookies: CookieService,
              private router: Router) { }

  ngOnInit() {
    this.tieneSexo();
    this.tieneFoto();
  }

  tieneSexo () {
    if (this.cookies.get('Sexo')!=='p') {
      this.sexo=this.cookies.get('Sexo');
    } 
  }

  tieneFoto () {
    if (this.cookies.get('Foto')!=='') {
      this.sexo=this.cookies.get('Foto');
    } 
  }

  volver() {
    this.modalCtrl.dismiss();
  }

    cambioFecha(event) {
    console.log('ionChange', event);
    console.log('Date', new Date(event.detail.value));
  }

  onSubmitTemplate(form: NgForm) {
    //Creo el usuario que va a pisar la base de datos
    const usuario: PerfilUsuarioModel = {
      apellido: form.value.apellido,
      fechaNac: form.value.fecha,
      foto: this.cookies.get('Foto'),
      nombre: form.value.nombre,
      sexo: form.value.sexo,
      tipoInicio: this.cookies.get('TipoInicio'),
      uid: this.cookies.get('UID')
    }
    //Llamo al metodo que hace el PUT y le mando el usuario
    this.authPlogger.editarUsuario( usuario );

    //Actualiza las cookies del usuario logueado
    this.cookies.set('Apellido', form.value.apellido);
    this.cookies.set('Nombre', form.value.nombre);
    this.cookies.set('FechaNac', form.value.fecha);
    this.cookies.set('Sexo',form.value.sexo);

    
    this.router.navigate(['/tabs']);
    
    this.volver();

  }

  async cambiarContrasena() {

    const mail = this.cookies.get('Mail');
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
}
