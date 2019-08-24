import { Component, OnInit } from '@angular/core';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { PublicacionModel } from 'src/app/models/publicacion.model';
import { CookieService } from 'ngx-cookie-service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.component.html',
  styleUrls: ['./publicar.component.scss'],
})
export class PublicarComponent implements OnInit {

  constructor(private publicarService:PublicacionesService,
              private a:UsuarioPloggerService,
              private cookies:CookieService,
              private alertCtrl:AlertController) { }

  ngOnInit() {}

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

    //debugger;
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
    this.publicarService.guardarPost(this.publicacion).subscribe();
    this.publicacion.texto='';
  }

  subirFoto() {

  }

  sacarFoto() {

  }

}
