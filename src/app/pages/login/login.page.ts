import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalLoginPage } from '../modal-login/modal-login.page';
import { ModalController } from '@ionic/angular';
import { ModalRegisterPage } from '../modal-register/modal-register.page';
import { UsuarioService } from '../../services/usuario-facebook.service';
import { UsuarioServiceGoogle } from 'src/app/services/usuarioGoogle.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router,
              private modalCtrl: ModalController,
              public us: UsuarioService,
              public usGoogle: UsuarioServiceGoogle) { }

  ngOnInit() {
  }

    // Inicio de session via Google
    iniciarSesionGoogle() {
      this.usGoogle.login();

    }

    // Inicio de session via Facebook
    iniciarSesionFacebook() {
      this.us.login();
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

    // Navega al profile
    irProfile() {
      this.router.navigate(['/profile']);
    }
}
