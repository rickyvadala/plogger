import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalLoginPage } from '../modal-login/modal-login.page';
import { ModalController } from '@ionic/angular';
import { ModalRegisterPage } from '../modal-register/modal-register.page';
import { UsuarioService } from '../../services/usuario-social.service';


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
              ) { }

  ngOnInit() {
    //cuando guardamos y se refresca la web sin logout quedan guardadas cosas en la memoria, con esto se borra
    localStorage.removeItem('token');
  }

    public logoutDelRichs() {
        this.us.logout();
    }



    // Inicio de session via Facebook
    iniciarSesionSocial(proveedor) {
      this.us.login(proveedor);
    }

    // Inicio de session via Plogger
    async iniciarSesionPlogger() {
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
