import { Component, OnInit, AfterViewChecked, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import { PopoverController, AlertController, PickerController } from '@ionic/angular';
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
import { Router } from '@angular/router';
import { PopLikesComponent } from '../pop-likes/pop-likes.component';
import { EventoComponent } from '../evento/evento.component';
import { PopPublicacionesReportComponent } from '../pop-publicaciones-report/pop-publicaciones-report.component';
import { LoadingService } from '../../services/loading.service'

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
})

export class PublicacionComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('infinite') infiniteScroll;
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
  publicacionesAll:any[]=[];
  comentarios:ComentarioModel[]=[];
  uid:string;
  cantPosts:Number;
  flagComentarios:boolean=false;

  flagLike:boolean;
  fotoReportada= false;

  usuario:PerfilUsuarioModel={};

  conEvento = false;

  ubicacion:String;

  defaultColumnOptions = [
    [
      'Desnudos o actividad sexual',
      'Lenguajes que incitan al odio',
      'Violencia u organizaciones peligrosas',
      'Bullying o acoso',
      'Informacion falsa'
    ]
  ]
   multiColumnOptions = [
    
  ]

  @Output() mensajeEvent = new EventEmitter<string>();

  @ViewChild('evento') evento: EventoComponent;

  constructor(private popoverCtrl: PopoverController,
              private publicacionService:PublicacionesService,
              private alertCtrl: AlertController,
              public imagePicker: ImagePicker,
              public file: File,
              private dataShare: DataShareService,
              public camera: Camera,
              public router: Router,
              private pickerController: PickerController,
              public loadingService: LoadingService,
              ) { }
  ngOnInit() {
    this.dataShare.currentMessage.subscribe( mensaje => this.popClick = mensaje);
    this.dataShare.currentUser.subscribe( usuario => {
      this.usuario = usuario
    });

    this.verificarPath();
 
  }

  ngOnDestroy() {
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
    this.ubicacion = ubicacion;
    if (ubicacion==='profile') {
      this.publicaciones=[];
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
    let UID = this.usuario.uid;
    this.loadingService.presentLoading();

    this.suscripcion=this.publicacionService.obtenerPublicacionesPerfil(UID)
    .subscribe((resp: any) => {
      let cant = new Number(resp.length)
      this.publicacionesAll = resp
      this.publicaciones.push(...this.publicacionesAll.splice(0,5)); 
      this.cantPosts = cant;
      this.loadingService.dismissLoading();

      // this.publicaciones.forEach(p => {
        
      //   if(p.evento) {
      //     this.conEvento = true;
      //     console.log(p.evento);
      //     this.evento.mostrarEventoPublicacion(p.evento);
      //   }
      // });
      if (this.publicacionService.cambioNombre === true ){
        this.publicaciones = this.publicacionService.publicaciones;
      }
      this.enviarMensaje();
      }  
    );   
  }

  cargarPublicacionesHome(){
    this.loadingService.presentLoading();
    this.suscripcion=this.publicacionService.obtenerPublicacionesHome()
    .subscribe(resp => {
      let cant = new Number(resp.length)
      
      this.publicacionesAll = resp
      this.publicaciones.push(...this.publicacionesAll.splice(0,5)); 
      this.loadingService.dismissLoading();  
      this.cantPosts = cant;

      if (this.publicacionService.cambioNombre === true ){
        this.publicaciones = this.publicacionService.publicaciones;
      } 
      this.enviarMensaje();
    }); 
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

  getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

   getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }

    return options;
  }

  async mostrarPopReport(evento,i, publicacion:PublicacionModel) {
    const popover = await this.popoverCtrl.create({
      component: PopPublicacionesReportComponent,
      event: evento,
      mode: 'ios',
      componentProps: {
        publicacion:publicacion
      }
    });
    await popover.present();
    popover.onDidDismiss().then( resp => {
 
      if (this.popClick=== "reportar") {
        //console.log('reportar', i, publicacion.pid);
       
        let nombrePublica = publicacion.nombre + publicacion.apellido;
        let pidPublicacion = publicacion.pid;
        //this.reportAlert(i,publicacion,pidPublicacion,nombrePublica);
        this.openPicker(i, event,publicacion,pidPublicacion,nombrePublica)
       }
       
    });
  }

  async openPicker(i, event,publicacion,pidPublicacion,nombrePublica,numColumns = 1, numOptions = 5, columnOptions = this.defaultColumnOptions){
    const picker = await this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),  
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (motivo) => {
        this.reportAlert(i,publicacion,motivo,pidPublicacion,nombrePublica);
      }
        }
      ]
    });
    await picker.present();
  }

  async reportAlert(i,publicacion,motivo,pidPublicacion,nombrePublica) {
    const alert = await this.alertCtrl.create({
      //header: 'Gracias por reportar esta publicación',
       subHeader: 'Gracias por reportar esta publicación',
      message: 'Si crees que esta publicación infringe nuestras normas y políticas de seguridad, márcala como inapropiada',
      buttons: [{
        text: 'Cancelar',
        handler: (blah) => {
          return;
        }
      },
        {
          text: 'Inapropiada',
          handler: (blah) => {
         
            let personaQueReporta = this.usuario.nombre + ' ' + this.usuario.apellido;
            this.publicacionService.motivoReporte(publicacion,motivo);
            this.publicacionService.report(publicacion,personaQueReporta).subscribe(resp => {
              if (this.usuario.reportados===undefined) {
               // this.usuario.reportados=[pidPublicacion]; 
              
                this.publicacionService.borrarPost(publicacion).subscribe();
                this.publicaciones.splice(i,1);
                this.publicacion.reportada=true;
              }else {
                  //  this.usuario.reportados.unshift(pidPublicacion); 
                this.publicacionService.borrarPost(publicacion).subscribe();
                this.publicaciones.splice(i,1);
                this.publicacion.reportada=true;   
              }
              return;
            });
            return;
          }
        }
      ]
    });
      await alert.present();
    
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
    this.publicaciones[0].uid=this.usuario.key;

    this.publicacionService.compartirPost(this.publicaciones[0]).subscribe( resp => {
      this.verificarPath();
    } );
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
        let descripcion ="A " +  this.usuario.nombre + " " + " le gustó tu publicacion";
        // this.notificationPushService.sendNotification(descripcion, this.key).subscribe(resp =>{
        // });
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
    this.publicacion.uid = this.usuario.key;
    this.publicacion.fecha = (new Date).toString();
    this.publicacion.nombre = this.usuario.nombre;
    this.publicacion.apellido = this.usuario.apellido;
    this.publicacion.fotoPerfil = this.usuario.foto;
    this.publicacion.reportada = false;

    if (this.publicacion.texto==='' && this.publicacion.foto==='') {
      const alert = await this.alertCtrl.create({
        header: 'Publicacion vacia!',
        subHeader: 'Debes ingresar al menos un texto o una foto!',
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
      targetWidth: 800,
      targetHeight: 800,
      correctOrientation: true,
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
  }
}

  doRefresh( event){
    this.publicaciones = []
    this.infiniteScroll.disabled = false;
    this.verificarPath();
    event.target.complete();
  }

  borrarComentario(j, comentario, i, publicacion) {
    this.publicacionService.borrarComentarioPost(publicacion, comentario).subscribe( resp => {
      this.publicaciones[i].comentarios.splice(j,1);
    });
    
  }

  goToProfileOther(i) {
    let otherProfileUid = this.publicaciones[i].uid;
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

  goToEvent(evento) {
    this.router.navigate([`/event/${evento.id}`],  {state:  evento} );
  }

  loadData(event) {
    setTimeout(() => {
      if (this.publicacionesAll.length === 0) {
        event.target.complete();
        this.infiniteScroll.disabled = true;
        return;
      }
      this.publicaciones.push(...this.publicacionesAll.splice(0,5)); 
      event.target.complete();
    }, 500);
  }
}
