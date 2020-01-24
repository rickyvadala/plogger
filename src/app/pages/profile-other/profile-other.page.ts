import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioPloggerService } from '../../services/usuario-plogger.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { FollowService } from 'src/app/services/follow.service';
import { PopFollowComponent } from 'src/app/components/pop-follow/pop-follow.component';
import { PopoverController } from '@ionic/angular';
import { notificationPushService } from '../../services/notificationPush.service';

@Component({
  selector: 'app-profile-other',
  templateUrl: './profile-other.page.html',
  styleUrls: ['./profile-other.page.scss'],
})
export class ProfileOtherPage implements OnInit {
  x = window.location.href;
  keyOther = this.x.substring(this.x.lastIndexOf('/') + 1);  

  nombre = '';
  foto = '../../assets/img/default-user.png';
  cantPosts = null;
  cantSeguidores = null;
  cantSeguidos = null;
  profileOtherUid: string;  
  flagFollow:boolean;
  usuario:PerfilUsuarioModel;
  profileOther:any[];
  key:string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioPloggerService,
              private dataShare: DataShareService,
              private followService: FollowService,
              private popoverCtrl:PopoverController,
              public notificationPushService: notificationPushService) {
    this.profileOtherUid = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getProfileOther();
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });
  }

  ionViewDidEnter(){
    this.getProfileOther();
  }

  volver() {
    this.router.navigate(['/tabs/home']);
  }

  getProfileOther() {
    this.usuarioService.obtenerPerfiles().subscribe(profiles => {
      this.profileOther = profiles.filter(prof => prof.key == this.profileOtherUid);
      let nombre = this.profileOther[0].nombre;
      let apellido = this.profileOther[0].apellido;
      this.nombre = nombre.concat(' ').concat(apellido);
      this.foto = this.profileOther[0].foto;
      this.key = this.profileOther[0].token;

      //Cantidad de seguidos
      if (this.profileOther[0].seguidos === undefined) {
        this.cantSeguidos = 0;
      } else {
        this.cantSeguidos = this.profileOther[0].seguidos.length;
      }
      //Cantidad de seguidores
      if (this.profileOther[0].seguidores === undefined) {
        this.cantSeguidores = 0;
      } else {
        this.cantSeguidores = this.profileOther[0].seguidores.length;
      }
    });
  }

  recibirMensaje($event) {
    this.cantPosts = $event
  }


  followOrUnfollow(){
    var seguidos = this.usuario.seguidos
    if (seguidos === undefined) {
      this.flagFollow=true;
      return true;
    } 
    else {
      for (let index = 0; index < seguidos.length; index++) {
        if (seguidos[index] === this.keyOther) {
          this.flagFollow=false;
          return false;
        }        
      }
      this.flagFollow=true;
      return true;
    }
  }

  follow () {
    this.followService.follow(this.keyOther).subscribe(resp =>{
      if (this.usuario.seguidos===undefined) {
        this.usuario.seguidos=[this.keyOther];
        this.profileOther[0].seguidores=[this.usuario.key];
      } else {
        this.usuario.seguidos.unshift(this.keyOther);
        this.profileOther[0].seguidores.push(this.usuario.key);
      }
      this.cantSeguidores=this.cantSeguidores+1;
      let descripcion = this.usuario.nombre + " " + "comenzó a seguirte";
      this.notificationPushService.sendNotification(descripcion, this.key).subscribe(resp =>{console.log(this.key)});
      return;
    });
  }

  unfollow () {
    this.followService.unfollow(this.keyOther).subscribe(resp =>{
      for (let i = 0; i < this.usuario.seguidos.length; i++) {
        if (this.usuario.seguidos[i]===this.keyOther) {
          this.usuario.seguidos.splice(i,1);
          this.cantSeguidores=this.cantSeguidores-1;
          for (let j = 0; j < this.profileOther[0].seguidores.length; j++) {
            if (this.profileOther[0].seguidores[j]===this.usuario.key) {
              this.profileOther[0].seguidores.splice(j,1)
            }
          }
          return;
        }        
      }
    });
  }

  async verFollows(param:string){
    let data:any;
    if (param==='Seguidores') {
      data = this.profileOther[0].seguidores;
    } else {
      data = this.profileOther[0].seguidos;
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
