import { Injectable, OnInit } from '@angular/core';
import { PublicacionModel } from '../models/publicacion.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
//import { CookieService } from 'ngx-cookie-service';
import { DataShareService } from './data-share.service';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { ComentarioModel } from '../models/comentario.model';
@Injectable({
  providedIn: 'root'
})
export class PublicacionesService{
  private urlABM = 'https://plogger-437eb.firebaseio.com';
  usuario:PerfilUsuarioModel={};

  constructor(private http:HttpClient,
              //private cookies:CookieService,
              private dataShare: DataShareService
              ) { 
                this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
              }

  /* 
  Para que estemos en la misma:
  -Los metodos get, delete, push, se hacen una sola vez limpios. 
  y se los llama adentro de el metodo particular que tenga c/u
  -La publicacion en BD va a estar vinculada con el UID de cada usuario y los atributos son
  los del objeto PublicacionModel que esta en models/publicacion.model.ts
  */

  guardarPost(publicacion: PublicacionModel) {
    //Postea la publicacion
    return this.http.post(`${this.urlABM}/publicacion.json`, publicacion);
  }

  obtenerPublicacionesPerfil(UID:string){
      return this.http.get(`${ this.urlABM }/publicacion.json`)
      .pipe(
        map( resp=>this.crearArregloPerfil(resp) )
      );
  }

  private crearArregloPerfil(resp){
    const publicaciones: PublicacionModel[] = [];
    //const uid = this.cookies.get('UID');
    let uid = this.usuario.uid;

    if (resp===null||resp===undefined) {return [];}

    Object.keys(resp).forEach(key =>{
      if (resp[key].uid===uid) {
        const publicacion: PublicacionModel = resp[key];
        publicacion.pid = key;

        //Armo el vector iterable para los comentarios de las publicaciones
        const comentarios: ComentarioModel[] = [];
        var x = resp[key].comentarios;
        console.log(x);
        if (x === undefined || x === null) {
          publicacion.comentarios = [];
        }
        else {
          Object.keys(resp[key].comentarios).forEach(keyComentario =>{
            let comentario: ComentarioModel = resp[key].comentarios[keyComentario];
            comentario.cid = keyComentario.toString();
            comentarios.unshift(comentario);
          });
        }
        publicacion.comentarios = comentarios;
        //Aca termina la parte de comentarios
        publicaciones.unshift(publicacion);
      }
    });
    return publicaciones;
  }

  obtenerPublicacionesHome(){
    return this.http.get(`${ this.urlABM }/publicacion.json`)
    .pipe(
      map( resp=>this.crearArregloHome(resp) )
    );
  }

  private crearArregloHome(resp){
    if (resp===null||resp===undefined) {return [];}
    //Armo el vector iterable para las publicaciones
    const publicaciones: PublicacionModel[] = [];
    Object.keys(resp).forEach(key =>{
        let publicacion: PublicacionModel = resp[key];
        publicacion.pid = key;

        //Armo el vector iterable para los comentarios de las publicaciones
        const comentarios: ComentarioModel[] = [];
        var x = resp[key].comentarios;
        if (x === undefined || x === null) {
          publicacion.comentarios = [];
        }
        else {
          Object.keys(resp[key].comentarios).forEach(keyComentario =>{
            let comentario: ComentarioModel = resp[key].comentarios[keyComentario];
            comentario.cid = keyComentario.toString();
            comentarios.unshift(comentario);
          });
        }
        publicacion.comentarios = comentarios;
        //Aca termina la parte de comentarios

        publicaciones.unshift(publicacion);
    });
    return publicaciones;
  }

  borrarPost(publicacion:PublicacionModel){
    return this.http.delete(`${ this.urlABM }/publicacion/${ publicacion.pid }.json`); 
  }

  editarPost(publicacion:PublicacionModel,textoEdit:string){
    var data = {texto:textoEdit}
    return this.http.patch(`${ this.urlABM }/publicacion/${ publicacion.pid }.json`,JSON.stringify(data)); 
  }

  comentarPost(publicacion:PublicacionModel, comentario:ComentarioModel){
    return this.http.post(`${ this.urlABM }/publicacion/${ publicacion.pid }/comentarios.json`,comentario); 
  }

  borrarComentarioPost(publicacion:PublicacionModel, comentario:ComentarioModel) {
     return this.http.delete(`${ this.urlABM }/publicacion/${ publicacion.pid }/comentarios/${ comentario.cid }.json`); 
  }

}
