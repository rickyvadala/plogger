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

 usuario: UsuarioPloggerModel;

  constructor(private modalCtrl: ModalController,
              private router: Router,
              public authPlogger: UsuarioPloggerService,
              private alertCtrl: AlertController) { }


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

  ngOnInit() {
    this.usuario = new UsuarioPloggerModel();
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
}
