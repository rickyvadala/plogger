import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioPloggerService } from '../../services/usuario-plogger.service';
import { PerfilUsuarioModel } from '../../models/perfil-usuario.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-invitar-amigos',
  templateUrl: './invitar-amigos.page.html',
  styleUrls: ['./invitar-amigos.page.scss'],
})
export class InvitarAmigosPage implements OnInit {

  eid: string;
  usuarios: PerfilUsuarioModel[] = [];

  usuariosNoInvitados: PerfilUsuarioModel[] = [];

  listaInvitados: string[] = [];
  nuevaSeleccionInvitados: string[] = [];

  constructor( private route: ActivatedRoute, private usuarioPlogger: UsuarioPloggerService, 
              private eventoService: EventService) { }

  ngOnInit() {
   this.eid = this.route.snapshot.params['id'];
   this.obtenerInvitados();
  }

  obtenerInvitados() {
    this.eventoService.obtenerInvitados(this.eid).subscribe((resp: any[]) => {
      this.listaInvitados = resp;
      console.log(resp);
      if(this.listaInvitados) {
         this.obtenerUsuarios();
      }
    });
  }

  obtenerUsuarios() {
    this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
    this.usuarios = resp;
    // this.usuarios.forEach((us, index) => {
    //   this.listaInvitados.forEach(i => {
    //     if(us.key === i) {
    //         this.usuarios.splice(index, 1);
    //     }
    //   });

    // });
    });

    }

    onChange(event, us) {
      let check = event.detail.checked;
      if(check) {
        this.nuevaSeleccionInvitados.push(us.key);
      } else {
        this.nuevaSeleccionInvitados.forEach((invitado, index) => {
            if(invitado == us.key) {
              this.nuevaSeleccionInvitados.splice(index, 1);
            }
        });
      }
    }

    invitarAmigos() {
      this.eventoService.agregarInvitados(this.eid, this.nuevaSeleccionInvitados).subscribe();
    }

}
