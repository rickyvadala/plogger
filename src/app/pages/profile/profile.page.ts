import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopProfileSettingsComponent } from '../../components/pop-profile-settings/pop-profile-settings.component';
import { UsuarioService } from '../../services/usuario-social.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  foto: string;
  nombre: string;

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService, 
              public usPlogger: UsuarioPloggerService,
              private cookies: CookieService) { }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.getNombre();
    this.getFoto();
  }


  async mostrarPop(evento) {
    const popover = await this.popoverCtrl.create({
      component: PopProfileSettingsComponent,
      event: evento,
      mode: 'ios'
    });
    await popover.present();
  }

  // public mostrarNombreFoto () {
  //   debugger;
  //       //Nombre y foto que se muestra en el perfil
  //       if (this.us.usuario.nombre !== undefined) {
  //         this.nombre = this.us.usuario.nombre;
  //         this.foto = this.us.usuario.foto;
  //         return;
  //       } else {
  //         let nombre=this.cookies.get('Nombre');
  //         if (nombre!=='') {
  //           const foto = this.cookies.get('Foto');
  //           const apellido = this.cookies.get('Apellido');

  //           this.nombre=nombre.concat(' ').concat(apellido);
  //           if (foto!=='') {
  //             //aca deberia traer la foto de la cookie
  //             this.foto = '../../../assets/img/default-user.png';
  //           } else {
  //             this.foto = '../../../assets/img/default-user.png';
  //           }
  //         } else {
  //           const x = this.usPlogger.mail;
  //           this.nombre = x.slice(0, x.indexOf('@'));
  //           this.foto = '../../../assets/img/default-user.png';
  //           return;
  //         } 
  //       }
  // }

  getNombre () {
    let nombre = this.cookies.get('Nombre');
    let apellido = this.cookies.get('Apellido');
    this.nombre=nombre.concat(' ').concat(apellido);
  }

  getFoto(){
    this.foto = this.cookies.get('Foto');
  }

}
