import { Component, OnInit } from '@angular/core';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { Subscription } from 'rxjs';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopLikesComponent } from '../pop-likes/pop-likes.component';
import { PublicacionModel } from 'src/app/models/publicacion.model';


@Component({
  selector: 'app-publicaciones-reportadas',
  templateUrl: './publicaciones-reportadas.component.html',
  styleUrls: ['./publicaciones-reportadas.component.scss'],
})
export class PublicacionesReportadasComponent implements OnInit {

  private suscripcion: Subscription;
  publicaciones:any[]=[];
  usuario:PerfilUsuarioModel={};
  popClick: string;
  flagLike:boolean;


  constructor(private publicacionService: PublicacionesService,
              private dataShare: DataShareService,
              public router: Router,
              private popoverCtrl: PopoverController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.dataShare.currentMessage.subscribe( mensaje => this.popClick = mensaje);
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });
    this.cargarPublicacionesReportadas();
  }

  cargarPublicacionesReportadas(){
    this.suscripcion=this.publicacionService.obtenerPublicacionesReportadas()
    .subscribe(resp => {
      this.publicaciones = resp; 
      }  
    );  
  }

  doRefresh( event){
    event.target.complete();
  }

  goToProfileOther(i) {
    let otherProfileUid = this.publicaciones[i].uid;
    console.log(otherProfileUid);
    if(otherProfileUid === this.usuario.key){ 
      this.router.navigate(['/tabs/profile']);
      // return;
     } else {
      this.router.navigate(['/profile', otherProfileUid]);
     }
  }

  mostrarLikes(i) {
    if (this.publicaciones[i].like===undefined || this.publicaciones[i].like.length===0) {
      return false;
    } else {
      return true;
    }
  }

  goToEvent(evento) {
    this.router.navigate([`/event/${evento.id}`],  {state:  evento} );
  }

  async verLikes(i){
    let likes = this.publicaciones[i].like;
    const popover = await this.popoverCtrl.create({
      component: PopLikesComponent,
      mode: 'ios',
      componentProps: {
        likes:likes
      }
    });
    await popover.present();
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

  comentar(i,publicacion:PublicacionModel){
    let elem = document.getElementsByClassName("i"+i) as HTMLCollectionOf<HTMLElement>;
    var x = window.location.href;
    var ubicacion = x.substring(x.lastIndexOf('/') + 1);
    for (let index = 0; index < elem.length; index++) {
      const element = elem[index].closest('app-'+ubicacion);
      if (element !== null && element.tagName.toLowerCase()==='app-'+ubicacion) {
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

  aceptarReporte(i,publicacion){
    this.publicacionService.borrarPublicacionReportada(publicacion).subscribe();
   
    this.publicacionReportadaEliminada(i);
  
  }

  cancelarReporte(i,item){
    let nombrePublicacion = item.nombre + ' '+ item.apellido;
    this.publicacionService.guardarPost(item).subscribe(resp =>{
      
      this.publicacionService.borrarPublicacionReportada(item).subscribe();
      this.publicacionReportadaCancelada(i,item,nombrePublicacion);
      return;

    });
  }

  async publicacionReportadaEliminada(i) {
    const alert = await this.alertCtrl.create({
      //header: 'Gracias por reportar esta publicación',
       subHeader: 'Publicación eliminada',
      message: '',
      buttons: [{
        text: 'Ok',
        handler: (blah) => {
          this.publicaciones.splice(i,1);
          
          return;
        }
      }
      ]
    });
      await alert.present();
    
  }

  async publicacionReportadaCancelada(i,item,nombrePublicacion) {
    const alert = await this.alertCtrl.create({
      //header: 'Gracias por reportar esta publicación',
       subHeader: 'Cancelar publicacioón reportada',
      message: 'La publicación de '+ nombrePublicacion +' cumple con nuestros terminos y condiciones',
      buttons: [{
        text: 'Ok',
        handler: (blah) => {
          this.publicaciones.splice(i,1);
          return;
        }
      }
      ]
    });
      await alert.present();
    
  }

}
