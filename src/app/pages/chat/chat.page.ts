import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MensajeModel } from 'src/app/models/mensaje.model';
import { DataShareService } from 'src/app/services/data-share.service';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  mensaje: string = "";
  chats: MensajeModel [] = [];
  usuario: any;
  usuarios: any;
  usuarioDestinatario: any;
  elemento: any;


  constructor(  public chatService: ChatService,
    private dataShare: DataShareService,
    private usuarioPlogger: UsuarioPloggerService,
    private router: Router
    ) { 

this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario );
this.usuarioDestinatario = this.router.getCurrentNavigation().extras.state;
this.chatService.cargarMensajes() .subscribe( ()=>{

  setTimeout( ()=>{
    this.elemento.scrollTop = this.elemento.scrollHeight;
  },20);


});

    }

ngOnInit() {
  

  //this.enviarMensaje();
  //this.obtenerUsuarios();
  this.elemento = document.getElementById('app-mensajes');
  
}




obtenerUsuarios() {

this.usuarioPlogger.obtenerPerfiles().subscribe(resp => {
this.usuarios = resp;
})
}




enviarMensaje(){

  if( this.mensaje.length === 0 ){
    return;
  }

  this.chatService.agregarMensaje( this.mensaje )
          .then( ()=>this.mensaje = "" )
          .catch( (err)=>console.error('Error al enviar',  err ) );



}

// guardarMensaje ( texto: string ) {

// let mensaje: MensajeModel = {
// nombre: this.usuario.nombre,
// apellido: this.usuario.apellido,
// mensaje: texto,
// fecha: new Date().toISOString(),
// uidUsuarioLogueado: this.usuario.uid,
// uidUsuarioDestinatario: this.usuarioDestinatario.uid,
// foto: this.usuario.foto
// }
// this.chatService.guardarChat(mensaje).subscribe(() => {

// });
// this.mensaje = '';
// }


}
