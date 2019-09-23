import { Component, OnInit } from '@angular/core';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-users-chat',
  templateUrl: './users-chat.page.html',
  styleUrls: ['./users-chat.page.scss'],
})
export class UsersChatPage implements OnInit {

  usuarios: any;


  constructor(   private router: Router,
                 private usuarioPlogger: UsuarioPloggerService,
                 private chatService: ChatService
    ) { 

    }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {

    this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
    this.usuarios = resp;
    })
    }

    goToChat(i) {
      this.router.navigate(['chat'], {state:  this.usuarios[i]});
      this.chatService.usuarioDestinatario = this.usuarios[i].key;
    }

}
