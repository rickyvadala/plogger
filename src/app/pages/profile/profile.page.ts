import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopProfileSettingsComponent } from '../../components/pop-profile-settings/pop-profile-settings.component';
import { UsuarioService } from './../../services/usuario-facebook.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService) { }

  ngOnInit() {
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
