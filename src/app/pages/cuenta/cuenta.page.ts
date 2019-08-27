import { Component, OnInit } from '@angular/core';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { AlertController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  usuario: PerfilUsuarioModel;




  constructor(private authPlogger: UsuarioPloggerService, 
              private alertCtrl: AlertController,
              private cookies: CookieService,
              private router: Router) { }

  ngOnInit() {
     this.usuario = {
      uid: this.cookies.get('UID'),
      nombre: this.cookies.get('Nombre'),
      apellido: this.cookies.get('Apellido'),
      fechaNac: this.cookies.get('FechaNac'),
      sexo: this.cookies.get('Sexo'),
      foto: this.cookies.get('Foto'),
      tipoInicio: this.cookies.get('TipoInicio')
    };
  }

  volver() {
    this.router.navigate(['/tabs/profile']);
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
      uid: this.cookies.get('UID'),
      mail:this.cookies.get('Mail')
    }
    //Llamo al metodo que hace el PUT y le mando el usuario
    this.authPlogger.editarUsuario( usuario );

    //Actualiza las cookies del usuario logueado
    this.cookies.set('Apellido', form.value.apellido);
    this.cookies.set('Nombre', form.value.nombre);
    this.cookies.set('FechaNac', form.value.fecha);
    this.cookies.set('Sexo',form.value.sexo);
    
    
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
