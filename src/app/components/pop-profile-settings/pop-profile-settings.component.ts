import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario-social.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { LoginPage } from 'src/app/pages/login/login.page';
import { LoginPageModule } from 'src/app/pages/login/login.module';
import { ModalProfilePage } from 'src/app/pages/modal-profile/modal-profile.page';

@Component({
  selector: 'app-pop-profile-settings',
  templateUrl: './pop-profile-settings.component.html',
  styleUrls: ['./pop-profile-settings.component.scss'],
})
export class PopProfileSettingsComponent implements OnInit {
  
  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService,
              private modalCtrl: ModalController) { }

  ngOnInit() {}

  // click para logout con redes sociales
  cerrarSesion() {
    // click para logout con redes sociales
    this.us.logout();
    
    // Plogger sale con estos dos
    localStorage.removeItem('token');
    this.popoverCtrl.dismiss();
  }

        // Editar perfil de la cuenta
        async editarCuenta() {
          const modal = await this.modalCtrl.create({
            component: ModalProfilePage
          });
          await modal.present();
          const {data} = await modal.onDidDismiss();
        }



}
