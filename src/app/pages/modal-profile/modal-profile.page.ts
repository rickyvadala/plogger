import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { NgForm } from '@angular/forms';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.page.html',
  styleUrls: ['./modal-profile.page.scss'],
})
export class ModalProfilePage implements OnInit {

  usuario: PerfilUsuarioModel = {
    uid: '',
    nombre: '',
    apellido: '',
    fechaNac: '',
    sexo: '',
    foto: '',
    tipoInicio: ''
  };
  email = 'cocosanmartino@hotmail.com';


  constructor(private modalCtrl: ModalController, private authPlogger: UsuarioPloggerService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  volver() {
    this.modalCtrl.dismiss();
  }

    cambioFecha(event) {
    console.log('ionChange', event);
    console.log('Date', new Date(event.detail.value));
  }

  onSubmitTemplate(form: NgForm) {


  }

  async cambiarContrasena() {
    return await this.authPlogger.sendPasswordResetEmail(this.email).then(resp => {
      console.log(resp);
      this.emailEnviado();
  });
}

  async emailEnviado() {

    const alert = await this.alertCtrl.create({
    header: 'Email enviado',
    // subHeader: 'Subtitle',
    message: 'Se ha enviado un email de reesatblecimiento de contraseña',
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
