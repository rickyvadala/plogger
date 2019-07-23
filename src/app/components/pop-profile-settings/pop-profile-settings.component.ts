import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { UsuarioService } from './../../services/usuario-facebook.service';


@Component({
  selector: 'app-pop-profile-settings',
  templateUrl: './pop-profile-settings.component.html',
  styleUrls: ['./pop-profile-settings.component.scss'],
})
export class PopProfileSettingsComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService) { }

  ngOnInit() {}

  onClick() {
    this.us.logout();
    this.popoverCtrl.dismiss();
  }



}
