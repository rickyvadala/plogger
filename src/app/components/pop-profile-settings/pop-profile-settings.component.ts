import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { UsuarioService } from './../../services/usuario-facebook.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { UsuarioServiceGoogle } from 'src/app/services/usuarioGoogle.service';

@Component({
  selector: 'app-pop-profile-settings',
  templateUrl: './pop-profile-settings.component.html',
  styleUrls: ['./pop-profile-settings.component.scss'],
})
export class PopProfileSettingsComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController,
              private us: UsuarioService,
              private authPlogger: UsuarioPloggerService,
              private usGoogle: UsuarioServiceGoogle) { }

  ngOnInit() {}

  // click para logout
  onClick() {
    console.log('Inicio por facebook',this.us.tipoInicio);
    console.log('Inicio por google',this.usGoogle.tipoInicio);
    console.log('Inicio por plogger',this.authPlogger.tipoInicio);
    if (this.us.tipoInicio !== undefined) {
      console.log('facebook');
      this.us.logout();
    } else {
      if (this.authPlogger.tipoInicio !== undefined) {
        console.log('plogger');
        this.authPlogger.logout();
      } else {
        console.log('google');
        this.usGoogle.logout();
      }
    }
    localStorage.removeItem('token');
    this.popoverCtrl.dismiss();
  }



}
