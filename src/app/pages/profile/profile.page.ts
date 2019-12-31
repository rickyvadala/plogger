import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopProfileSettingsComponent } from '../../components/pop-profile-settings/pop-profile-settings.component';
import { UsuarioService } from '../../services/usuario-social.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { PopFollowComponent } from 'src/app/components/pop-follow/pop-follow.component';
import { Router } from '@angular/router';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  @ViewChild('publicaciones') publicaciones;

  foto: string;
  nombre: string;
  cantPosts:string;
  cantSeguidores = null;
  cantSeguidos = null;
  hayPublicacion = true;

  usuario:PerfilUsuarioModel={};
  esAdmin = false;
  showEvent= false;
  showPublic = true;
  primerIngreso = true;

  constructor(private popoverCtrl: PopoverController,
              public us: UsuarioService, 
              public usPlogger: UsuarioPloggerService,
              private dataShare: DataShareService,
              private router: Router,
              ) { 
              }

  ngOnInit() {
    console.log("ngOninit")
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
    this.usuarioAdmin();
    this.primerIngreso = true;
  }

  usuarioAdmin(){
    if (this.usuario.admin === true ) {
      this.esAdmin = true;
    }else{
      this.esAdmin = false;
    }
  }

  ionViewWillEnter(){
    this.getNombre();
    this.getFoto();
    if (this.primerIngreso != true) {
      this.publicaciones.ngOnInit();
    } else this.primerIngreso = false
  }
  ionViewWillLeave (){
    this.publicaciones.publicaciones = [];
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

  goToReports() {
    this.router.navigate(['/reports']);
  }

  mostrarPublicacion(){
  this.showPublic = true;
  this.showEvent = false;
  }

  mostrarEvento(){
    this.showPublic = false;
  this.showEvent =true ;
  }

  
}
