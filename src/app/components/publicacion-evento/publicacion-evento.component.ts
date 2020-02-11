import { Component, OnInit, AfterViewChecked, Output, EventEmitter, Input} from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { PopPublicacionSettingsComponent } from '../pop-publicacion-settings/pop-publicacion-settings.component';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { Subscription } from 'rxjs';
import { PublicacionModel } from 'src/app/models/publicacion.model';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { storage } from 'firebase';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { LoadingService } from '../../services/loading.service'


@Component({
  selector: 'app-publicacion-evento',
  templateUrl: './publicacion-evento.component.html',
  styleUrls: ['./publicacion-evento.component.scss'],
})
export class PublicacionEventoComponent implements OnInit {

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

  @Input() eid: string;

  @Output() mensajeEvent = new EventEmitter<string>();

  constructor(private popoverCtrl: PopoverController,
              private publicacionService:PublicacionesService,
              private alertCtrl: AlertController,
              public imagePicker: ImagePicker,
              public file: File,
              private dataShare: DataShareService,
              public camera: Camera,
              public router: Router,
              private eventService: EventService,
              public loadingService: LoadingService,
              public route: ActivatedRoute
              ) {}

  ngOnInit() {
    this.dataShare.currentMessage.subscribe( mensaje => this.popClick = mensaje);
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });
    this.cargarPublicacionesEvento();
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.   
    
  }
  
  ionViewWillEnter(){
    this.cargarPublicacionesEvento();
  }

  cargarPublicacionesEvento(){
    this.loadingService.presentLoading();

    this.suscripcion=this.eventService.obtenerEventos()
    .subscribe(resp => {
      let evento = resp.filter(e => e.id == this.eid );
      this.publicaciones = evento[0].publicaciones;
      this.loadingService.dismissLoading();  
    }  
    );  
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
    this.eventService.likePost(this.eid,publicacion).subscribe( resp => {
      if (this.publicaciones[i].like===undefined) {
        this.publicaciones[i].like=[this.usuario.uid];
      } else {
        this.publicaciones[i].like.unshift(this.usuario.uid);
      }
      return;
    });

  }

  dislike(i,publicacion:PublicacionModel) {
    this.eventService.dislikePost(this.eid,publicacion).subscribe( resp => {
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

    this.publicacion.uid = this.usuario.key;
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

      this.eventService.publicarEnEvento(this.eid, this.publicacion).subscribe(resp => {
        this.cargarPublicacionesEvento();
        this.hayFoto = false;
        this.publicacion.texto='';
        this.publicacion.foto = '';
        return;
      });

    }
  }

  subirFoto() {
    this.options = {
      width: 800,
      height: 800,
      quality: 70,
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
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 800,
      targetHeight: 800
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
  }
}

  doRefresh( event){
    // this.verificarPath();
    event.target.complete();
  }

  borrarComentario(j, comentario, i, publicacion) {
    this.publicacionService.borrarComentarioPost(publicacion, comentario).subscribe( resp => {
      this.publicaciones[i].comentarios.splice(j,1);
    });
    
  }

  goToProfileOther(i) {
    let otherProfileUid = this.publicaciones[i].uid;
    if(otherProfileUid === this.usuario.uid){ 
      this.router.navigate(['/tabs/profile']);
      // return;
     } else {
      this.router.navigate(['/profile', otherProfileUid]);
     }
    
  }


}
