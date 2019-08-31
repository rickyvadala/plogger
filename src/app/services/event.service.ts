import { Injectable } from '@angular/core';
import { EventoModel } from '../models/evento.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataShareService } from './data-share.service';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

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

      eventos.unshift(evento);
  });
  return eventos;
}

borrarEvento(evento: EventoModel) {
  return this.http.delete(`${ this.urlABM }/evento/${evento.id}`);
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
    eventos.unshift(evento);
  }
});
return eventos; 
}

}
