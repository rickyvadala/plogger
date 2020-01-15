import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { timeout } from 'q';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { NgForm } from '@angular/forms';
import { UsuarioPloggerModel } from 'src/app/models/usuario-plogger.model';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.page.html',
  styleUrls: ['./modal-login.page.scss'],
})

export class ModalLoginPage implements OnInit {
  token:string;

 usuario: UsuarioPloggerModel;

  constructor(private modalCtrl: ModalController,
              private router: Router,
              public authPlogger: UsuarioPloggerService,
              private alertCtrl: AlertController) {
              }


  async contraseñaInvalida(error: string, form: NgForm) {
       if (error === 'INVALID_PASSWORD') {
              error = 'Contraseña inválida';

              const alert = await this.alertCtrl.create({
        header: error,
        // subHeader: 'Subtitle',
        message: 'La contraseña que ingresaste es incorrecta. Vuelve a intentarlo',
        buttons: [
          {
            text: 'Ok',
            handler: (blah) => {
              // form.reset();
              return;
            }
          }
        ]
      });
              await alert.present();
        }

       if (error === 'EMAIL_NOT_FOUND') {
          error = 'Usuario no registrado';

          const alert = await this.alertCtrl.create({
    header: error,
    // subHeader: 'Subtitle',
    // message: 'La contraseña que ingresaste es incorrecta. Vuelve a intentarlo',
    buttons: [
      {
        text: 'Ok',
        handler: (blah) => {
          return;
        }
      }
    ]
  });
          await alert.present();
    }

    }

    async ingreseMail() {

      const alert = await this.alertCtrl.create({
      header: 'Ingrese email:',
      inputs: [{
       name: 'name1',
       type: 'text',
       placeholder: 'Email'
     }],
      buttons: [
        {
          text: 'Cancelar',
          handler: (data) => {
            return;
          }
        },
        {
          text: 'Ok',
          handler: (data) => {
            return this.authPlogger.sendPasswordResetEmail(data.name1).then(resp => {
              this.emailEnviado();
            }).catch( err => {
              console.log(err);
              this.emailNoValido(err.message, err.code);
            });
            return;
          }
        }
      ]
    });
      await alert.present();
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

    async emailNoValido(mensaje: string, error: string) {
     const alert = await this.alertCtrl.create({
     header: 'Usuario no encontrado',
     // subHeader: 'Subtitle',
     message: mensaje,
     buttons: [
       {
         text: 'Ok',
         handler: (blah) => {
           return;
         }
       }
     ]
   });
     await alert.present();
     }

  ngOnInit() {
    this.usuario = new UsuarioPloggerModel();
    this.usuario = {
      email: 'ricky@gmail.com',
      password: '12345678'
    };
  }

  volver() {
    this.modalCtrl.dismiss();
  }

  login(form: NgForm) {
    if (form.invalid) { return; }
    this.authPlogger.login(this.usuario)

    .subscribe( resp => {
     
      this.modalCtrl.dismiss();
      this.router.navigate(['/tabs/home']);
    }, (err) => {
      this.contraseñaInvalida(err.error.error.message, form);
    });
  }

  async olvidasteContrasena() {
      this.ingreseMail();
  }
}
