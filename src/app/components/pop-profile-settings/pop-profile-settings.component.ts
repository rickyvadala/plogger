import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario-social.service';
import { ModalProfilePage } from 'src/app/pages/modal-profile/modal-profile.page';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-pop-profile-settings',
  templateUrl: './pop-profile-settings.component.html',
  styleUrls: ['./pop-profile-settings.component.scss'],
})
export class PopProfileSettingsComponent implements OnInit {
  
  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService,
              private modalCtrl: ModalController,
              private cookies: CookieService ) { }

  ngOnInit() {}

  // click para logout con redes sociales
  cerrarSesion() {
    // click para logout con redes sociales
    this.us.logout();

    //Borrar cookies cool buena onda bff
    console.log(this.cookies.getAll());  
    this.cookies.deleteAll();
    
    // Plogger sale con estos dos
    localStorage.removeItem('token');
    this.popoverCtrl.dismiss();
  }

        // Editar perfil de la cuenta
        async editarCuenta() {    
          this.popoverCtrl.dismiss();

          const modal = await this.modalCtrl.create({
            component: ModalProfilePage
          });
          await modal.present();
          const {data} = await modal.onDidDismiss();
        }



}
