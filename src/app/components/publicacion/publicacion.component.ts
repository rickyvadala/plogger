import { Component, OnInit, AfterViewChecked, Output, EventEmitter} from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopPublicacionSettingsComponent } from '../pop-publicacion-settings/pop-publicacion-settings.component';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
//import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { PublicacionModel } from 'src/app/models/publicacion.model';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { storage } from 'firebase';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
})

export class PublicacionComponent implements OnInit, AfterViewChecked {

  private suscripcion: Subscription;
  textoEditar:string="";

  popClick:string;

  images: any[];
  imageURL: string;

  imagStorage: string;
  
  imageResponse: any;
  options: ImagePickerOptions;

  hayFoto = false;

  foto = "../../../assets/img/default-user.png";
  nombre = "Nombre Harcodeado";
  imagenPublicacion = "../../../assets/shapes.svg";
  publicaciones:any[]=[];
  comentarios:ComentarioModel[]=[];
  uid:string;
  cantPosts:number;
  flagComentarios:boolean=false;

  flagLike:boolean;

  usuario:PerfilUsuarioModel={};

  @Output() mensajeEvent = new EventEmitter<string>();

  constructor(private popoverCtrl: PopoverController,
              private publicacionService:PublicacionesService,
              //private cookies: CookieService,
              private alertCtrl: AlertController,
              public imagePicker: ImagePicker,
              public file: File,
              private dataShare: DataShareService,
              public camera: Camera,
              public router: Router
              ) { }
  ngOnInit() {
    this.dataShare.currentMessage.subscribe( mensaje => this.popClick = mensaje);
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });

    this.verificarPath();
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.   
    
  }
  
  ionViewWillEnter(){
    this.cargarPublicacionesHome();
    this.cargarPublicacionesPerfil();
  }

  verificarPath(){
    // Ubicacion te dice si estas en perfil o en home, porque aunque es el mismo componente app-publicacion,
    // cada uno se carga con distinto metodo, cargarPublicacionesPerfil() y otro cargarPublicacionesHome()
    var x = window.location.href;
    var ubicacion = x.substring(x.lastIndexOf('/') + 1);
    if (ubicacion==='profile') {
      this.cargarPublicacionesPerfil();
      return;
    } 
    if (ubicacion==='home') {
      this.publicaciones=[];
      this.cargarPublicacionesHome();
      return;
    } 
    return;
  }


  confirmarEdicion(i, publicacion:PublicacionModel) {
    if (this.textoEditar==="") {
      return;
    }
    this.publicacionService.editarPost(publicacion, this.textoEditar).subscribe( resp => {
      this.cancelarEdicion(i);
      this.publicaciones[i].texto = this.textoEditar;
      this.textoEditar="";
    });


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
    //let UID=this.cookies.get('UID');
    let UID = this.usuario.uid;

    this.suscripcion=this.publicacionService.obtenerPublicacionesPerfil(UID)
    .subscribe(resp => {
      this.publicaciones = resp;
      this.cantPosts = resp.length;
      this.enviarMensaje();
      }  
    );   
  }

  cargarPublicacionesHome(){
    this.suscripcion=this.publicacionService.obtenerPublicacionesHome()
    .subscribe(resp => {
      this.publicaciones = resp; 
      }  
    );  
  }

  async mostrarPop(evento,i, publicacion:PublicacionModel) {
    const popover = await this.popoverCtrl.create({
      component: PopPublicacionSettingsComponent,
      event: evento,
      mode: 'ios',
      componentProps: {
        publicacion:publicacion
      }
    });
    await popover.present();
    popover.onDidDismiss().then( resp => {
     if (this.popClick==="borrar") {
      this.publicaciones.splice(i,1);
     }
     if (this.popClick==="editar") {
       let elem = document.getElementsByClassName("c"+i) as HTMLCollectionOf<HTMLElement>;
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


  // Publicar

  publicacion: PublicacionModel = {
    uid:'',
    texto: '',
    fecha:'',
    foto: '',
    video:'',
    like: {
    },
    comentarios: {
    },
    nombre:'',
    apellido:'',
    fotoPerfil:''
  
  }

  async publicar() {

    // this.publicacion.uid = this.cookies.get('UID');
    // this.publicacion.fecha = (new Date).toString();
    // this.publicacion.nombre = this.cookies.get('Nombre');
    // this.publicacion.apellido = this.cookies.get('Apellido');
    // this.publicacion.fotoPerfil = this.cookies.get('Foto');

    this.publicacion.uid = this.usuario.uid;
    this.publicacion.fecha = (new Date).toString();
    this.publicacion.nombre = this.usuario.nombre;
    this.publicacion.apellido = this.usuario.apellido
    this.publicacion.fotoPerfil = this.usuario.foto;

    if (this.publicacion.texto==='' && this.publicacion.foto==='') {
      const alert = await this.alertCtrl.create({
        header: 'Publicacion vacia!',
        subHeader: 'Debes ingresar al menos un texto o una foto!',
        // message: 'This is an alert message.',
        buttons: [ {
            text: 'Ok',
            cssClass: 'danger'
          }
        ]
      });
  
      await alert.present();
      return;
    } else {

      this.publicacionService.guardarPost(this.publicacion).subscribe(resp => {
  
        //this.publicaciones.push(this.publicacion)
        this.verificarPath();
        this.hayFoto = false;
        this.publicacion.texto='';
        this.publicacion.foto = '';
        return;
      });

    }
  }

  subirFoto() {
    this.options = {
    
      width: 200,
      quality: 25,
      outputType: 1,
      maximumImagesCount: 1

    };
    this.imageResponse = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
      
      this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
      this.imageURL = this.imageResponse[i];
      this.hayFoto = true;
      }

      let rnd = ( Math.random() * (9999999999)).toString();
      let img = 'pictures/publicaciones/foto' + rnd  ;
      
      const pictures = storage().ref(img);
      pictures.putString(this.imageURL, 'data_url');

      this.publicacion.foto = this.imageURL;

    }, (err) => {
      alert(err);
    });  


  }


  
  async sacarFoto() {

    let result1;
    this.imageResponse = [];
    try{

    const options: CameraOptions = { 
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    await this.camera.getPicture(options).then((result) => {
      this.imageResponse.push('data:image/jpeg;base64,' + result);
      this.imageURL = this.imageResponse[0];
      this.hayFoto = true;
          result1 = result
    });

    let rnd = ( Math.random() * (9999999999)).toString();
    let img = 'pictures/publicaciones/foto' + rnd  ;

    const pictures = storage().ref(img);
    pictures.putString(this.imageURL, 'data_url', );

    this.publicacion.foto = this.imageURL;

  } catch (e) {
    console.log(e); 
  }
}

  doRefresh( event){
    this.verificarPath();
    console.log(this.publicaciones);
    event.target.complete();
  }

  borrarComentario(j, comentario, i, publicacion) {
    this.publicacionService.borrarComentarioPost(publicacion, comentario).subscribe( resp => {
      this.publicaciones[i].comentarios.splice(j,1);
    });
    
  }

  goToProfileOther(i) {
    console.log(this.publicaciones[i].uid);
    let otherProfileUid = this.publicaciones[i].uid;
    if(otherProfileUid == this.usuario.uid){ return; }
    this.router.navigate(['/profile', otherProfileUid]).then();
  }

}
