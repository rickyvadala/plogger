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
    // .pipe(
    //   map( (resp: any) => {
    //     let nroUsuario = this.cookies.get('Usuario');
    //     //Obtiene las publicaciones del usuario
    //     this.http.get(`${ this.urlABM }/perfil/${ nroUsuario }/publicaciones.json`)
    //     .subscribe((x:any) => {
    //       let publicacionesArray: any[]; 
    //       if (x!==null) {
    //         //aca viene cuando el usuario ya tiene publicaciones
    //         publicacionesArray = x;
    //         publicacionesArray.push(resp.name);
    //         this.http.put(`${ this.urlABM }/perfil/${ nroUsuario }/publicaciones.json`,publicacionesArray).subscribe();    
    //         return;
    //       }
    //       //aca viene cuando un usuario hace su primer publicacion
    //       publicacionesArray = [resp.name]; 
    //       this.http.put(`${ this.urlABM }/perfil/${ nroUsuario }/publicaciones.json`,publicacionesArray).subscribe();    
    //     });
    //   })
    // );
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
        // // debugger;
        if (x === undefined || x === null) {
          publicacion.comentarios = [];
        }
        else {
          Object.keys(resp[key].comentarios).forEach(keyComentario =>{
            // // debugger;
            let comentario: ComentarioModel = resp[key].comentarios[keyComentario];
            comentario.cid = keyComentario;
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
    //const arrayKeys: any[] = Object.keys(resp);

    console.log(resp);
    // // debugger;
    //Armo el vector iterable para las publicaciones
    const publicaciones: PublicacionModel[] = [];
    Object.keys(resp).forEach(key =>{
        let publicacion: PublicacionModel = resp[key];
        publicacion.pid = key;

        //Armo el vector iterable para los comentarios de las publicaciones
        const comentarios: ComentarioModel[] = [];
        var x = resp[key].comentarios;
        console.log(x);
        // // debugger;
        if (x === undefined || x === null) {
          publicacion.comentarios = [];
        }
        else {
          Object.keys(resp[key].comentarios).forEach(keyComentario =>{
            // // debugger;
            let comentario: ComentarioModel = resp[key].comentarios[keyComentario];
            comentario.cid = keyComentario;
            comentarios.unshift(comentario);
          });
        }
        publicacion.comentarios = comentarios;
        //Aca termina la parte de comentarios

        publicaciones.unshift(publicacion);
    });
    console.log(publicaciones);
    // // debugger;
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

  // obtenerComentariosPublicacion(publicacion:PublicacionModel){
  //   return this.http.get(`${ this.urlABM }/publicacion/${ publicacion.pid }/comentarios.json`)
  //   .pipe(
  //     map( resp=>this.crearArregloComentarios(resp) )
  //   );
  // }

  // private crearArregloComentarios(resp){
  //   if (resp===null||resp===undefined) {return [];}
  //   const comentarios: ComentarioModel[] = [];
  //   Object.keys(resp).forEach(key =>{
  //       let comentario: ComentarioModel = resp[key];
  //       comentario.cid = key;
  //       comentarios.unshift(comentario);
  //   });
  //   return comentarios;
  // }

}
