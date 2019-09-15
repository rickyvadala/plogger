import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioPloggerService } from '../../services/usuario-plogger.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { FollowService } from 'src/app/services/follow.service';

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

  constructor(private route: ActivatedRoute,
              private usuarioService: UsuarioPloggerService,
              private router: Router,
              private dataShare: DataShareService,
              private followService: FollowService ) {
    this.profileOtherUid = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getProfileOther();
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });
  }

  getProfileOther() {
    this.usuarioService.obtenerPerfiles().subscribe(profiles => {
      let profileOther = profiles.filter(prof => prof.key == this.profileOtherUid);
      let nombre = profileOther[0].nombre;
      let apellido = profileOther[0].apellido;
      this.nombre = nombre.concat(' ').concat(apellido);
      this.foto = profileOther[0].foto;
      //Cantidad de seguidos
      if (profileOther[0].seguidos === undefined) {
        this.cantSeguidos = 0;
      } else {
        this.cantSeguidos = profileOther[0].seguidos.length;
      }
      //Cantidad de seguidores
      if (profileOther[0].seguidores === undefined) {
        this.cantSeguidores = 0;
      } else {
        this.cantSeguidores = profileOther[0].seguidores.length;
      }
    });
  }

  recibirMensaje($event) {
    this.cantPosts = $event
  }


  followOrUnfollow(){
    debugger
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
      } else {
        this.usuario.seguidos.unshift(this.keyOther);
      }
      this.cantSeguidores=this.cantSeguidores+1;
      return;
    });
  }

  unfollow () {
    this.followService.unfollow(this.keyOther).subscribe(resp =>{
      for (let index = 0; index < this.usuario.seguidos.length; index++) {
        if (this.usuario.seguidos[index]===this.keyOther) {
          this.usuario.seguidos.splice(index,1);
          this.cantSeguidores=this.cantSeguidores-1;
          return;
        }        
      }
    });
    
  }

}
