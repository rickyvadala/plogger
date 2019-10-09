import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { DataShareService } from '../../services/data-share.service';
import { PerfilUsuarioModel } from '../../models/perfil-usuario.model';

@Component({
  selector: 'app-asistiran',
  templateUrl: './asistiran.page.html',
  styleUrls: ['./asistiran.page.scss'],
})
export class AsistiranPage implements OnInit {

  asistiranUid: any;
  asistiran: any [] = [];
  usuario: PerfilUsuarioModel;

  constructor( public router: Router, public profileService: UsuarioPloggerService, public dataShare: DataShareService ) { 
    this.asistiranUid = this.router.getCurrentNavigation().extras.state;
    this.dataShare.currentUser.subscribe(usuario => {
      this.usuario = usuario;
    } );
  }

  ngOnInit() {
    this.buscarPersonas();

  }

  buscarPersonas() {
   console.log( this.asistiranUid);
    let perfiles: any [] = []
    this.profileService.obtenerPerfiles().subscribe( resp => { 
      perfiles = resp;
      perfiles.forEach( p => {
        for (let i = 0; i < this.asistiranUid.length; i++) {
          if( p.key == this.asistiranUid[i]){
            this.asistiran.push(p);
            return;
          } 
        }
        
      });
    });
  }

  goToProfile(key) {
    if(key !== this.usuario.key) {
      this.router.navigate(['/profile', key]);
    } else {
      this.router.navigate(['/tabs/profile']);
    }
  }

}
