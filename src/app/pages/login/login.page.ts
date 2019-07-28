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

  recordarme = false;

  constructor(private router: Router,
              private modalCtrl: ModalController,
              private us: UsuarioService,
              private usGoogle: UsuarioServiceGoogle) { }

  ngOnInit() {
  }

    // Inicio de session via Google
    iniciarSesionGoogle() {
      this.usGoogle.login();
      console.log('Iniciando sesion via google');
    }

    // Inicio de session via Facebook
    iniciarSesionFacebook() {
      this.us.login();
      console.log('Iniciando sesion via facebook');
    }

    // Inicio de session via Plogger
    async iniciarSesionPlogger() {
      console.log('Iniciando sesion via plogger');
      const modal = await this.modalCtrl.create({
        component: ModalLoginPage
      });
      await modal.present();
      const {data} = await modal.onDidDismiss();
    }

    // Registrar nuevo usuario via Plogger
    async registrarPlogger() {
      const modal = await this.modalCtrl.create({
        component: ModalRegisterPage
      });
      await modal.present();
      const {data} = await modal.onDidDismiss();
    }

    // Navega al home
    irHome() {
      this.router.navigate(['/tabs']);
    }
}
