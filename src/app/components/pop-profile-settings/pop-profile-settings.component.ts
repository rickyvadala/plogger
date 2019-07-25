import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { UsuarioService } from './../../services/usuario-facebook.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';


@Component({
  selector: 'app-pop-profile-settings',
  templateUrl: './pop-profile-settings.component.html',
  styleUrls: ['./pop-profile-settings.component.scss'],
})
export class PopProfileSettingsComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService,
              public authPlogger: UsuarioPloggerService) { }

  ngOnInit() {}

  onClick() {
    if (this.us.tipoInicio !== undefined) {
      console.log('facebook');
      this.us.logout();
    } else {
      if (this.authPlogger.tipoInicio !== undefined) {
        console.log('plogger');
      } else {
        console.log('google');
      }
    }
    localStorage.removeItem('token');

    this.popoverCtrl.dismiss();
  }



}
