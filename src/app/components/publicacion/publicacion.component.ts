import { Component, OnInit, AfterViewChecked, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopPublicacionSettingsComponent } from '../pop-publicacion-settings/pop-publicacion-settings.component';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { PublicacionModel } from 'src/app/models/publicacion.model';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';

// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { storage } from 'firebase';


@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
})

export class PublicacionComponent implements OnInit, AfterViewChecked {

  private suscripcion: Subscription;

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
  uid:string;
  cantPosts:number;
  flagComentarios:boolean=false;

  @Output() mensajeEvent = new EventEmitter<string>();
  @ViewChild('inputComentar') inputComentar;

  constructor(private popoverCtrl: PopoverController,
              private publicacionService:PublicacionesService,
              private cookies: CookieService,
              private alertCtrl: AlertController,
              public imagePicker: ImagePicker,
              public file: File,
              // public camera: Camera,
              // private sanitizer: DomSanitizer
              ) { }
  ngOnInit() {
   this.verificarPath();
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.uid=this.cookies.get('UID');
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
    } else {
      return;
    }
  }

  enviarMensaje() {
    this.mensajeEvent.emit(this.cantPosts.toString());
  }
  

  cargarPublicacionesPerfil(){ 
    let UID=this.cookies.get('UID');

    this.suscripcion=this.publicacionService.obtenerPublicacionesPerfil(UID)
    .subscribe(resp => {
      console.log(resp)
      this.publicaciones = resp;
      this.cantPosts = resp.length;
      this.enviarMensaje();
      }  
    );   
  }

  cargarPublicacionesHome(){
    this.suscripcion=this.publicacionService.obtenerPublicacionesHome()
    .subscribe(resp => {
      console.log(resp)
      this.publicaciones = resp;
      }  
    );  
  }

  async mostrarPop(evento,i, publicacion:PublicacionModel) {
    debugger;
    console.log("i",i);
    console.log("publicacion",publicacion);
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
      console.log(resp.role);
     if (resp.role===undefined) {
      this.publicaciones.splice(i,1);
     }
    });
  }



  meGusta(){

  }

  comentar(i){
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

  confirmarComentario() {

  }

  compartir() {

  }


  // Publicar

  publicacion: PublicacionModel = {
    uid:'',
    texto: '',
    fecha:'',
    foto: '',
    video:'',
    meGusta: {
      uidMegusta:''
    },
    comentarios: {
      uidComentario:'',
      nombreComentario:'',
      apellidoComentario:'',
      fotoComentario:'',
      comentario:'',
      fechaComentario:''
    },
    nombre:'',
    apellido:'',
    fotoPerfil:''
  
  }

  async publicar() {

    this.publicacion.uid = this.cookies.get('UID');
    this.publicacion.fecha = (new Date).toString();
    this.publicacion.nombre = this.cookies.get('Nombre');
    this.publicacion.apellido = this.cookies.get('Apellido');
    this.publicacion.fotoPerfil = this.cookies.get('Foto');


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
    }
    this.publicacionService.guardarPost(this.publicacion).subscribe(resp => {
      this.verificarPath();
      this.hayFoto = false;
    });
    this.publicacion.texto='';
    this.publicacion.foto = '';
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
      let img = 'pictures/publicaciones' + rnd  ;
      
      const pictures = storage().ref(img);
      pictures.putString(this.imageURL, 'data_url');

      this.publicacion.foto = this.imageURL;
      console.log(this.publicacion);
      

      
      console.log('imageUrl');
      console.log(this.imageURL);

    }, (err) => {
      alert(err);
    });  


  }

  sacarFoto() {

  }

  doRefresh( event){
    this.verificarPath();
    event.target.complete();
  }

}
