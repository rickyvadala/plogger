import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario-social.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { LoginPage } from 'src/app/pages/login/login.page';
import { LoginPageModule } from 'src/app/pages/login/login.module';

@Component({
  selector: 'app-pop-profile-settings',
  templateUrl: './pop-profile-settings.component.html',
  styleUrls: ['./pop-profile-settings.component.scss'],
})
export class PopProfileSettingsComponent implements OnInit {

  us: UsuarioService;

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  // click para logout
  onClick() {
    

    // console.log('Inicio por facebook',this.us.tipoInicio);
    // console.log('Inicio por plogger',this.authPlogger.tipoInicio);
    // if (this.us.tipoInicio !== undefined) {
    //   console.log('facebook');
    //   this.us.logout();
    // } else {
    //   if (this.authPlogger.tipoInicio !== undefined) {
    //     console.log('plogger');
    //     this.authPlogger.logout();
    //   } else {
    //     console.log('google');
    //   }
    // }
    localStorage.removeItem('token');
    this.popoverCtrl.dismiss();
  }



}
