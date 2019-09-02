import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionModel } from 'src/app/models/publicacion.model';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { DataShareService } from '../../services/data-share.service';
import { PerfilUsuarioModel } from '../../models/perfil-usuario.model';


@Component({
  selector: 'app-publicacion-others',
  templateUrl: './publicacion-others.component.html',
  styleUrls: ['./publicacion-others.component.scss'],
})
export class PublicacionOthersComponent implements OnInit {

  private suscripcion: Subscription

  cantPosts: number;
  publicaciones: any[] = [];
  usuario: PerfilUsuarioModel = {};
  flagLike: boolean;

  @Input() profileOtherUid: string;
  @Output() mensajeEvent = new EventEmitter<string>();

  constructor(private publicacionService: PublicacionesService,
                      private dataShare: DataShareService) {
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });
   }

  ngOnInit() {
    this.cargarPublicacionesPerfil();
  }

  ionViewWillEnter(){
    this.cargarPublicacionesPerfil();
  }

  cancelarEdicion(i) {
    let elem = document.getElementsByClassName("c"+i) as HTMLCollectionOf<HTMLElement>;
    var x = window.location.href;
    var ubicacion = x.substring(x.lastIndexOf('/') + 1);
    for (let index = 0; index < elem.length; index++) {
      const element = elem[index].closest('app-'+ubicacion);
      if (element !== null && element.tagName.toLowerCase()==='app-'+ubicacion) {
        if (elem[index].style.display==='block') {
          elem[index].style.display = "none";
          return;
        }       
      }
    }
  }


  enviarMensaje() {
    //envia cant de post a profile
    this.mensajeEvent.emit(this.cantPosts.toString());
  }
  

  cargarPublicacionesPerfil(){ 
    let UID = this.profileOtherUid;

    this.suscripcion = this.publicacionService.obtenerPublicacionesPerfilOther(UID)
    .subscribe(resp => {
      this.publicaciones = resp;
      this.cantPosts = resp.length;
      this.enviarMensaje();
      }  
    );   
  }
//falta arreglar metodo comentar 
  comentar(i, publicacion:PublicacionModel){
    let elem = document.getElementsByClassName("i"+i) as HTMLCollectionOf<HTMLElement>;
    var x = window.location.href;
    var ubicacion = x.substring(x.lastIndexOf('/') + 1);
    for (let index = 0; index < elem.length; index++) {
      const element = elem[index].closest('app-'+ubicacion);
      if (element !== null && element.tagName.toLowerCase()==='app-profile-other') {
        if (elem[index].style.display==='' || elem[index].style.display==='none') {
          elem[index].style.display = "block";
          return;
        } else {
          elem[index].style.display = "none";
          return;
        }          
      }
    }
  }

  // ver porque no comenta!!!!!!!!
  confirmarComentario(i,publicacion:PublicacionModel) {
    let elem = document.getElementsByClassName("inputComentar"+i) as HTMLCollectionOf<HTMLElement>;
    var x = window.location.href;
    var ubicacion = x.substring(x.lastIndexOf('/') + 1);
    for (let index = 0; index < elem.length; index++) {
      const element = elem[index].closest('app-'+ubicacion);
      if (element !== null && element.tagName.toLowerCase()==='app-'+ubicacion) {
        let input = elem[index] as HTMLInputElement;
        if (input.value==='') {
          return;
        } else {
          let comentario: ComentarioModel = {
            cid:"",
            comentario:input.value,
            uidComentario: this.usuario.uid,
            apellidoComentario: this.usuario.apellido,
            nombreComentario: this.usuario.nombre,
            fotoComentario: this.usuario.foto,
            fechaComentario: (new Date).toString()
          }
          this.publicacionService.comentarPost(publicacion,comentario).subscribe( (resp:any) => {
            comentario.cid=resp.name;
            input.value="";
            this.publicaciones[i].comentarios.unshift(comentario);     
          });
          return;
        }          
      }
    }

  }

  // ver como hacer oara que no se miestre en el perfol del other

  compartir(i,publicacion:PublicacionModel) {
    //Me como este viaje para no referenciar al objeto compartido cuando hago los cambios    
    var repost = new PublicacionModel;
    this.publicaciones.unshift(repost);
    this.publicaciones[0].apellido=this.publicaciones[i+1].apellido;
    this.publicaciones[0].fotoPerfil=this.publicaciones[i+1].fotoPerfil;
    this.publicaciones[0].nombre=this.publicaciones[i+1].nombre;
    this.publicaciones[0].video=this.publicaciones[i+1].video;
    this.publicaciones[0].foto=this.publicaciones[i+1].foto;
    this.publicaciones[0].texto=this.publicaciones[i+1].texto;
    this.publicaciones[0].fecha=(new Date).toString();
    this.publicaciones[0].compartidoDeUid=this.publicaciones[i+1].uid;
    this.publicaciones[0].compartidoNomApe=this.usuario.nombre+" "+this.usuario.apellido;
    this.publicaciones[0].uid=this.usuario.uid;

    this.publicacionService.compartirPost(this.publicaciones[0]).subscribe();
  }


  likeOrDislike(i){
    var x = this.publicaciones[i].like;
    if (x === undefined) {
      this.flagLike=true;
      return true;
    } 
    else {
      for (let index = 0; index < x.length; index++) {
        if (x[index] === this.usuario.uid) {
          this.flagLike=false;
          return false;
        }        
      }
      this.flagLike=true;
      return true;
    }
  }

  like(i,publicacion:PublicacionModel) {
    this.publicacionService.likePost(publicacion).subscribe( resp => {
      if (this.publicaciones[i].like===undefined) {
        this.publicaciones[i].like=[this.usuario.uid];
      } else {
        this.publicaciones[i].like.unshift(this.usuario.uid);
      }
      return;
    });

  }

  dislike(i,publicacion:PublicacionModel) {
    this.publicacionService.dislikePost(publicacion).subscribe( resp => {
      for (let index = 0; index < this.publicaciones[i].like.length; index++) {
        if (this.publicaciones[i].like[index]===this.usuario.uid) {
          this.publicaciones[i].like.splice(index,1);
          return;
        }        
      }
    });
  }

  doRefresh( event){
    event.target.complete();
  }

  borrarComentario(j, comentario, i, publicacion) {
    this.publicacionService.borrarComentarioPost(publicacion, comentario).subscribe( resp => {
      this.publicaciones[i].comentarios.splice(j,1);
    });
  }
}
