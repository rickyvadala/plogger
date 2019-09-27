import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopProfileSettingsComponent } from '../../components/pop-profile-settings/pop-profile-settings.component';
import { UsuarioService } from '../../services/usuario-social.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { PopFollowComponent } from 'src/app/components/pop-follow/pop-follow.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  foto: string;
  nombre: string;
  cantPosts:string;
  cantSeguidores = null;
  cantSeguidos = null;
  hayPublicacion = true;

  usuario:PerfilUsuarioModel={};

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService, 
              public usPlogger: UsuarioPloggerService,
              private dataShare: DataShareService) { }

  ngOnInit() {
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
    if (this.usuario.seguidores===undefined) {
      this.cantSeguidores=0;
    } else {
      this.cantSeguidores=this.usuario.seguidores.length;
    }
    if (this.usuario.seguidos===undefined) {
      this.cantSeguidos=0;
    } else {
      this.cantSeguidos=this.usuario.seguidos.length;
    }
  }

  ionViewWillEnter(){
    this.getNombre();
    this.getFoto();
  }

  recibirMensaje($event) {
    this.cantPosts = $event;
    
    if ($event >= 1) { 
      this.hayPublicacion = true;
    } else {
      this.hayPublicacion = false;
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

  getNombre () {

    let nombre = this.usuario.nombre;
    let apellido = this.usuario.apellido;
    this.nombre=nombre.concat(' ').concat(apellido);
  }

  getFoto(){
    let currentUid = this.usuario.uid;
    this.usPlogger.obtenerUsuarioFoto().subscribe(resp => {
      let fotoUsr = '';
      const array: any[] = Object.values(resp);
      const ab = array.filter(a => a.uid === currentUid);
      fotoUsr = ab[0].foto;
      this.foto = fotoUsr;  
    })
  }

  async verFollows(param:string){
    let data:any;
    if (param==='Seguidores') {
      data = this.usuario.seguidores;
    } else {
      data = this.usuario.seguidos;
    }
    const popover = await this.popoverCtrl.create({
      component: PopFollowComponent,
      mode: 'ios',
      componentProps: {
        data:data
      }
    });
    await popover.present();
  }

}
