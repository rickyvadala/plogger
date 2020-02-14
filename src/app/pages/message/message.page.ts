import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MensajeModel } from 'src/app/models/mensaje.model';
import { DataShareService } from 'src/app/services/data-share.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  mensaje: string = "";
  chats: MensajeModel[] = [];
  usuario: any;
  usuarios: any[] = [];
  usuariosUid: any[] = [];
  usuarioDesti: string;

  usuariosChat: any[] = [];

  usConverRepetidos: any[] = [];
  usConver: any[] = []

  usConverTemporal: any[] = [];
  tieneMensajes = true;
  loading = true;

  chatBorrado: number;

  constructor(private chatService: ChatService,
    private dataShare: DataShareService,
    private usuarioPlogger: UsuarioPloggerService,
    private router: Router,
    public alertCtrl: AlertController
  ) {

    this.dataShare.currentUser.subscribe(usuario => { this.usuario = usuario });
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }


  obtenerUsuarios() {
    this.usuariosChat = [];
    this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
      let todos: any[];
      todos = resp;
      todos.forEach(u => {
        if (u.key !== this.usuario.key) {
          this.usuarios.push(u);
        }
      });

      this.chatService.cargarChats().subscribe((resp: MensajeModel[]) => {
        this.chats = resp;
        this.chats.forEach(mensaje => {
          this.usuarios.forEach(us => {
            if ((mensaje.uidUsuarioDestinatario === us.key) || (mensaje.uidUsuarioLogueado === us.key)) {
              this.usConver.push(us);
              this.tieneMensajes = false;
              this.loading = false;
              this.usConver.forEach((usC, index) => {
                this.usConverTemporal = Object.assign([], this.usConver);
                this.usConverTemporal.splice(index, 1);
                if ((this.usConverTemporal.indexOf(usC) == -1) && (this.usConverRepetidos.indexOf(usC) == -1)) {
                  this.usConverRepetidos.push(usC);
                }
              });
            }
          });
        });
        this.usuariosChat = this.usConverRepetidos;
      });
    });
    

  }

  goToChat(us, i) {
    this.router.navigate(['chat'], { state: us });
    this.chatService.usuarioDestinatario = us.key;

  }

  goToUserChat() {
    this.router.navigate(['/users-chat']);
  }

  borrarConversacion(us, index) {
    this.chatBorrado = index;
    this.borrarChat(us);
  }

  async borrarChat(us) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar conversación?',
      // subHeader: 'Subtitle',
      message: 'Si eliminas la conversación, desaparecerá de tu bandeja de entrada, pero no de la bandeja de los demás',
      buttons: [

        {
          text: 'Cancelar',
          handler: (blah) => {
            return;
          }
        },
        {
          text: 'Eliminar',
          handler: (blah) => {
            this.chatService.borrarMensajes(us);
            this.usuariosChat.splice(this.chatBorrado,1);
            return;
          }

        }
      ]
    });
    await alert.present();

  }

}
