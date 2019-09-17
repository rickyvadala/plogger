import { Injectable } from '@angular/core';
import { EventoModel } from '../models/evento.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataShareService } from './data-share.service';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { PublicacionModel } from '../models/publicacion.model';


@Injectable({
  providedIn: 'root'
})
export class EventService  {

  private urlABM = 'https://plogger-437eb.firebaseio.com';
  usuario: PerfilUsuarioModel={};

  constructor(private http: HttpClient,
              private dataShare: DataShareService) { 
  
     this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
              }
              

//postea el evento 
guardarEvento(evento: EventoModel) {
  return this.http.post(`${this.urlABM}/evento.json`, evento);
}

obtenerEventos(){
  return this.http.get(`${ this.urlABM }/evento.json`)
  .pipe(
    map( resp=>this.crearArregloEventos(resp) )
  );
}

private crearArregloEventos(resp){
  if (resp===null||resp===undefined) {return [];}
  //Armo el vector iterable para las publicaciones
  const eventos: EventoModel[] = [];
  Object.keys(resp).forEach(key =>{
    
      let evento: EventoModel = resp[key];
      evento.id = key;

      // arreglo publicaciones en evento

    const publicaciones: PublicacionModel[] = [];
    var x = resp[key].publicaciones;
    if (x === undefined || x === null) {
      evento.publicaciones = [];
    }
    else {
      Object.keys(resp[key].publicaciones).forEach(keyPublicacion =>{
        
        let publicacion: PublicacionModel = resp[key].publicaciones[keyPublicacion];
        publicacion.pid = keyPublicacion.toString();
        publicaciones.unshift(publicacion);
      });
    }
    evento.publicaciones = publicaciones;

// aca termina

      eventos.unshift(evento);
  });
  return eventos;
}

borrarEvento(eventoId: string) {
  return this.http.delete(`${ this.urlABM }/evento/${eventoId}.json`);
}

editarEvento(evento: EventoModel) {
  var data = {
   ...evento
  };
  return this.http.put(`${ this.urlABM }/evento/${evento.id}.json`, data);
}

obtenerMisEventos(){
  return this.http.get(`${ this.urlABM }/evento.json`)
  .pipe(
    map( resp=>this.crearArregloMisEventos(resp) )
  );
}

private crearArregloMisEventos(resp){
const eventos: EventoModel[] = [];
let uid = this.usuario.uid;

if (resp===null||resp===undefined) {return [];}

Object.keys(resp).forEach(key =>{
  if (resp[key].uid===uid) {
    const evento: EventoModel = resp[key];
    evento.id = key;

    // arreglo publicaciones en evento

    const publicaciones: PublicacionModel[] = [];
        var x = resp[key].publicaciones;
        if (x === undefined || x === null) {
          evento.publicaciones = [];
        }
        else {
          Object.keys(resp[key].publicaciones).forEach(keyPublicacion =>{
            
            let publicacion: PublicacionModel = resp[key].publicaciones[keyPublicacion];
            publicacion.pid = keyPublicacion.toString();
            publicaciones.unshift(publicacion);
          });
        }
        evento.publicaciones = publicaciones;

    // aca termina
    eventos.unshift(evento);
  }
});
return eventos; 
}

publicarEnEvento(eid: string, publicacion:PublicacionModel) {

  return this.http.post(`${this.urlABM}/evento/${eid}/publicaciones.json`, publicacion);
}

likePost(eid: string, publicacion:PublicacionModel){
  // Obtiene los like
  return this.http.get(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`)
  .pipe(map((x:any) => {
    let likeArray: any[]; 
    if (x!==null) {
      //aca viene cuando la publicacion ya tiene likes
      for (let index = 0; index < x.length; index++) {
        if (x[index]===this.usuario.uid) {
          return;
        }
      }
      likeArray = x;
      likeArray.push(this.usuario.uid);
      return this.http.put(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`,likeArray).subscribe();
    } else {
      //aca viene cuando es el primer like de una publicacion
      likeArray = [this.usuario.uid]; 
      return this.http.put(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`,likeArray).subscribe();    
    }
  }));
}

dislikePost(eid:string, publicacion: PublicacionModel){
  // Obtiene los like
  return this.http.get(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`)
  .pipe(map((x:any) => {
    if (x!==null) {
      for (let index = 0; index < x.length; index++) {
        if (x[index]===this.usuario.uid) {
          return this.http.delete(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like/${ index }.json`).subscribe();
        }
      }
    }
  }));
}

obtenerTipoEventos(){
  return this.http.get('https://plogger-437eb.firebaseio.com/tipoEvento.json')
  .pipe(
    map( resp=>this.crearArregloTipoEventos(resp) )
  );
}

private crearArregloTipoEventos(resp){
  if (resp===null||resp===undefined) {return [];}
  //Armo el vector iterable para las publicaciones
  const eventos: any[] = [];
  Object.keys(resp).forEach(key =>{
    
      let evento: any = resp[key];
     
      evento.buscarTipo = evento.descripcion;



      eventos.unshift(evento);
  });
  return eventos;
}

obtenerDescripcionTipoEventos(id){
  return this.http.get(`https://plogger-437eb.firebaseio.com/tipoEvento/${ id }.json`);
}



}
