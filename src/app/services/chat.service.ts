import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MensajeModel } from '../models/mensaje.model';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { DataShareService } from './data-share.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private urlABM = 'https://plogger-437eb.firebaseio.com';

  usuario: PerfilUsuarioModel;
  private itemsCollection: AngularFirestoreCollection<MensajeModel>;
  public chats: MensajeModel[] = [];
  usuarioDestinatario: any; 


  constructor(private http: HttpClient, 
              private afs: AngularFirestore,
              private dataShare: DataShareService) { 
  
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario) }

  

  cargarMensajes(){

    this.itemsCollection = this.afs.collection<MensajeModel>('chats', ref => ref.orderBy('fecha','desc')
                                                                             );

    return this.itemsCollection.valueChanges().pipe(
                              map( (mensajes: MensajeModel[]) =>{
                                this.chats = [];
                                mensajes.forEach(mensaje => {
                                  if( (mensaje.uidUsuarioLogueado == this.usuario.key && mensaje.uidUsuarioDestinatario == this.usuarioDestinatario) || (mensaje.uidUsuarioLogueado == this.usuarioDestinatario && mensaje.uidUsuarioDestinatario == this.usuario.key) ) {
                                    this.chats.unshift( mensaje );
                                  }
                                });
                                
                                return this.chats;
                              }))
  }


  agregarMensaje( texto: string ){

    let mensaje: any = {
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      mensaje: texto,
      fecha: new Date().toISOString(),
      uidUsuarioLogueado: this.usuario.key,
      uidUsuarioDestinatario: this.usuarioDestinatario,
      foto: this.usuario.foto
    }
    return this.itemsCollection.add( mensaje );
  }

  obtenerMensajes() {
   var ver = this.afs.collection('chats').valueChanges();
   //var mensajes = ver.where("nombre" == "nombre")
   
  return ver;
  }


  
}
