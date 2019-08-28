import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario-social.service';
// import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';

@Component({
  selector: 'app-pop-profile-settings',
  templateUrl: './pop-profile-settings.component.html',
  styleUrls: ['./pop-profile-settings.component.scss'],
})
export class PopProfileSettingsComponent implements OnInit {

  usuario:PerfilUsuarioModel={};
  
  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService,
              //private cookies: CookieService,
              private router: Router,
              private dataShare: DataShareService ) { }

  ngOnInit() {
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
  }

  // click para logout con redes sociales
  cerrarSesion() {
    // click para logout con redes sociales
    this.us.logout();

    //Borrar cookies cool buena onda bff
    //console.log(this.cookies.getAll());  
    //this.cookies.deleteAll();

    this.dataShare.changeUser(null);
    
    // Plogger sale con estos dos
    localStorage.removeItem('token');
    this.popoverCtrl.dismiss();
  }


  editarCuenta() {
    this.popoverCtrl.dismiss();
    this.router.navigate(['/cuenta']);
  }


}
