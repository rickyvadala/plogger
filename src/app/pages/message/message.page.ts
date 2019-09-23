import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MensajeModel } from 'src/app/models/mensaje.model';
import { DataShareService } from 'src/app/services/data-share.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { Router } from '@angular/router';
import { ChatPage } from '../chat/chat.page';


@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  mensaje: string = "";
  chats: MensajeModel [] = [];
  usuario: any;
  usuarios: any;
  usuarioDesti: string;

  constructor(  private chatService: ChatService,
                private dataShare: DataShareService,
                private usuarioPlogger: UsuarioPloggerService,
                private router: Router
    ) { 

this.dataShare.currentUser.subscribe( usuario => {this.usuario = usuario} );
    }

ngOnInit() {
this.obtenerUsuarios();
this.chatService.obtenerMensajes().subscribe(resp => console.log(resp))
}


obtenerUsuarios() {

this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
this.usuarios = resp;

});

}


goToUserChat() {
  this.router.navigate(['/users-chat']);
}

goToChat(i){
  this.router.navigate(['/chat'], {state:  this.usuarios[i]});
  this.chatService.usuarioDestinatario = this.usuarios[i].key;
}
}
