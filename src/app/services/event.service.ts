import { Injectable } from '@angular/core';
import { EventoModel } from '../models/evento.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private urlABM = 'https://plogger-437eb.firebaseio.com';

  constructor(private http: HttpClient,
             // private eventModel: EventoModel
              ) { }
              
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

}
