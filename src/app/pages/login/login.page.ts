import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalLoginPage } from '../modal-login/modal-login.page';
import { ModalController } from '@ionic/angular';
import { ModalRegisterPage } from '../modal-register/modal-register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router,
              private modalCtrl: ModalController) { }

  ngOnInit() {
  }

    // Inicio de session via Google
    iniciarSesionGoogle() {
      this.irHome();
    }

    // Inicio de session via Facebook
    iniciarSesionFacebook() {
      this.irHome();
    }

    // Inicio de session via Plogger
    async iniciarSesionPlogger() {
      const modal = await this.modalCtrl.create({
        component: ModalLoginPage,
        componentProps: {
          nombre: 'Ricky',
          pais: 'ARG'
        }
      });
      await modal.present();

      const {data} = await modal.onDidDismiss();
      console.log('Retorno del modal', data);
    }

    // Registrar nuevo usuario via Plogger
    async registrarPlogger() {
      const modal = await this.modalCtrl.create({
        component: ModalRegisterPage,
        componentProps: {
          nombre: 'Ricky',
          pais: 'ARG'
        }
      });
      await modal.present();
      const {data} = await modal.onDidDismiss();
      console.log('Retorno del modal', data);
    }

    // Navega al home
    irHome() {
      this.router.navigate(['/tabs']);
    }
}
