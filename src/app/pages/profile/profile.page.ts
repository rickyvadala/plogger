import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { PopProfileSettingsComponent } from '../../components/pop-profile-settings/pop-profile-settings.component';
import { UsuarioService } from '../../services/usuario-social.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  foto = '';
  nombre = '';

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService, 
              public usPlogger: UsuarioPloggerService) { }

  ngOnInit() {
    console.log('Facebook',this.us.usuario.nombre);
    console.log('Plogger',this.usPlogger.mail);

        if (this.us.usuario.nombre !== undefined) {
          this.nombre = this.us.usuario.nombre;
          this.foto = this.us.usuario.foto;
          return;
        } else {
            const x = this.usPlogger.mail;
            this.nombre = x.slice(0, x.indexOf('@'));
            this.foto = '../../../assets/img/default-user.png';
            return;
        }
  }

  async mostrarPop(evento) {
    const popover = await this.popoverCtrl.create({
      component: PopProfileSettingsComponent,
      event: evento,
      mode: 'ios'
    });
    await popover.present();
  }

}
