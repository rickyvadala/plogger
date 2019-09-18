import { Component, OnInit, ViewChild } from '@angular/core';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from '../../models/perfil-usuario.model';
import { EventoComponent } from '../../components/evento/evento.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { PublicacionModel } from '../../models/publicacion.model';
import { async } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-compartir-evento',
  templateUrl: './compartir-evento.page.html',
  styleUrls: ['./compartir-evento.page.scss'],
})
export class CompartirEventoPage implements OnInit {

  
  event: any;
  nombreTipoEvento: string;
  publicacion: PublicacionModel = {
    uid:'',
    texto: '',
    fecha:'',
    foto: '',
    evento: {},
    nombre:'',
    apellido:'',
    fotoPerfil:''
  
  }
  
  @ViewChild('evento') evento: EventoComponent;

  usuario: PerfilUsuarioModel = {};
  constructor(private dataShare :DataShareService, 
              public router: Router,
              private publicacionService: PublicacionesService,
              public alertCtrl: AlertController) { 

   this.event = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.evento.obtenerEventoCompartir(this.event);
    this.dataShare.currentUser.subscribe( usuario => { this.usuario = usuario;})
  }

  async publicar() {
    this.publicacion.apellido = this.usuario.apellido;
    this.publicacion.evento = this.event;
    this.publicacion.uid = this.usuario.key;
    this.publicacion.nombre = this.usuario.nombre;
    this.publicacion.fotoPerfil = this.usuario.foto;
    this.publicacion.fecha = (new Date()).toString()

    console.log(this.publicacion);
    this.publicacionService.guardarPost(this.publicacion).subscribe(resp => {   
      this.publicacionCreada();  
      
      return;
    });
    
  }

  async publicacionCreada() {
    const alert = await this.alertCtrl.create({
      header: 'Evento compartido',
      // subHeader: 'Subtitle',
      message: 'Gracias por difundir!!',
      buttons: [
        {
          text: 'Ok',
          handler: (blah) => {
            this.router.navigate(['/tabs/home']);
            return;
          }
        }
      ]
    });
      await alert.present();
    
  }

}
