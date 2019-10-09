import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioPloggerService } from '../../services/usuario-plogger.service';
import { PerfilUsuarioModel } from '../../models/perfil-usuario.model';
import { EventService } from 'src/app/services/event.service';
import { AlertController } from '@ionic/angular';

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
              private eventoService: EventService, private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {
   this.eid = this.route.snapshot.params['id'];
   this.obtenerInvitados();
  }

  obtenerInvitados() {
    this.eventoService.obtenerInvitados(this.eid).subscribe((resp: any[]) => {
      this.listaInvitados = resp;
      console.log(resp);
      if(this.listaInvitados) {
         this.obtenerUsuarios(true);
      } else {
        this.obtenerUsuarios(false);
      }
    });
  }

  obtenerUsuarios(hayInvitados: boolean) {
    if (hayInvitados) {
      this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
        let usuariostemp = resp;
        console.log(usuariostemp);
        usuariostemp.forEach((us, index) => {
          this.listaInvitados.forEach(i => {
            if(us.key === i) {
              usuariostemp.splice(index, 1);
              return;
            }
            console.log(usuariostemp);
    
          });
    
        });
        this.usuarios = usuariostemp;
        });

    } else {
      this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
       this.usuarios = resp;
        });
    
    }
    
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
      this.eventoService.agregarInvitados(this.eid, this.nuevaSeleccionInvitados).subscribe(resp => {
        console.log(resp);
        this.amigosInvitados();
      });
    }

    async amigosInvitados() {
      const alert = await this.alertCtrl.create({
        header: 'Usted ha invitado exitosamente a sus amigos!',
        buttons: [
          {
            text: 'Ok',
            handler: (blah) => {
              this.router.navigate([`/event/${this.eid}`]);
  
            }
          }
        ]
      });
      await alert.present();
    }
}
