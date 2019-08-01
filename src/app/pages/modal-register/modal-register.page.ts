import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuarioPloggerModel } from '../../models/usuario-plogger.model';
import { NgForm } from '@angular/forms';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.page.html',
  styleUrls: ['./modal-register.page.scss'],
})
export class ModalRegisterPage implements OnInit {

  usuario: UsuarioPloggerModel;

  contValidas = false;

  constructor(private modalCtrl: ModalController,
              private router: Router,
              private authPlogger: UsuarioPloggerService,
              public alertCtrl: AlertController) { }



  async registroCorrecto() {
      const alert = await this.alertCtrl.create({
        header: 'Usuario registrado',
        subHeader: 'Bienvenido a plogger!',
        message: 'Entre todo podemos salvar el planeta!',
        buttons: [
          {
            text: 'Ok',
            handler: (blah) => {
              console.log('Boton ok');

            }
          }
        ]
      });
      await alert.present();
    }

    async registroIncorrecto(error) {
      if (error===400) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          subHeader: 'Email ya registrado',
          message: 'Si ya tiene cuenta inicie sesion o intente con otro mail',
          buttons: [
            {
              text: 'Ok',
              handler: (blah) => {
                console.log('Boton ok');
  
              }
            }
          ]
        });
        await alert.present();
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          subHeader: 'No tiene conexion a internet',
          message: 'Verifique su conexion e intente nuevamente',
          buttons: [
            {
              text: 'Ok',
              handler: (blah) => {
                console.log('Boton ok')
              }
            }
          ]
        });
        await alert.present();

      }

    }


  ngOnInit() {
    this.usuario = new UsuarioPloggerModel();
  }

  volver() {
    this.modalCtrl.dismiss();
  }

  onSubmitTemplate(form: NgForm) {

    if ( form.invalid ) { return; }

    this.authPlogger.nuevoUsuarioPlogger(this.usuario)
    .subscribe( (resp: any) => {
      const usr = {
        nombre: '',
        apellido: '',
        fechaNac: '',
        sexo: '',
        foto: '',
        tipoInicio: 'p',
        uid: resp.localId
      };
      console.log(usr);
      this.authPlogger.crearPerfil(usr)
      .subscribe(resp => {
        console.log(resp);
      });

      this.registroCorrecto();
      this.modalCtrl.dismiss();
      this.router.navigate(['/tabs']);
    }, (err) => {
      console.log(err.status);
      this.registroIncorrecto(err.status);
    });
  }

  validarContrasena(pass1, pass2) {
    if ( pass1 === pass2 ) {
      this.contValidas = true;
    } else {
      this.contValidas = false;
    }
  }

}
