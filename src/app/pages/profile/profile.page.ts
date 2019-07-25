import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopProfileSettingsComponent } from '../../components/pop-profile-settings/pop-profile-settings.component';
import { UsuarioService } from './../../services/usuario-facebook.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService,
              public usPlogger: UsuarioPloggerService) { }



  ngOnInit() {
    if (!this.us.usuario.nombre) {
      const x = this.usPlogger.mail;
      const y = x.slice(0, x.indexOf("@"));
      console.log(x);
      console.log(y);
      this.us.usuario.nombre = y;
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
