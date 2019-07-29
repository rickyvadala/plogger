import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
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
              private us: UsuarioService,
              private usPlogger: UsuarioPloggerService) { }

  ngOnInit() {
    console.log('Facebook',this.us.usuario.nombre);
    console.log('Plogger',this.usPlogger.mail);

        if (this.us.usuario.nombre !== undefined) {
          console.log("luki face");
          this.nombre = this.us.usuario.nombre;
          this.foto = this.us.usuario.foto;
          return;
        // } else {
        //   if (this.usGoogle.usuario.nombre !== undefined) {
        //     console.log("luki google");
        //     this.nombre = this.usGoogle.usuario.nombre;
        //     this.foto = this.usGoogle.usuario.foto;
        //     return;
        //   } else {
        //     console.log("luki plogger");
        //     const x = this.usPlogger.mail;
        //     this.nombre = x.slice(0, x.indexOf('@'));
        //     this.foto = '../../../assets/img/default-user.png';
        //     return;
        //   }
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
