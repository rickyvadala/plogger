import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopProfileSettingsComponent } from '../../components/pop-profile-settings/pop-profile-settings.component';
import { UsuarioService } from '../../services/usuario-social.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  foto: string;
  nombre: string;
  cantPosts:string;

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

  recibirMensaje($event) {
    this.cantPosts = $event
  }


  async mostrarPop(evento) {
    const popover = await this.popoverCtrl.create({
      component: PopProfileSettingsComponent,
      event: evento,
      mode: 'ios'
    });
    await popover.present();
  } 

  getNombre () {
    let nombre = this.cookies.get('Nombre');
    let apellido = this.cookies.get('Apellido');
    this.nombre=nombre.concat(' ').concat(apellido);
  }

  getFoto(){
    let currentUid = this.cookies.get('UID')
    // console.log('UID');
    // console.log(currentUid);
    this.usPlogger.obtenerUsuarioFoto().subscribe(resp => {
      let fotoUsr = '';
      const array: any[] = Object.values(resp);
      const ab = array.filter(a => a.uid === currentUid);
      fotoUsr = ab[0].foto;
      this.foto = fotoUsr;
  
      // console.log('fotoUsr', fotoUsr);
  
  })
  }

}
