import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AutoCompleteService } from 'ionic4-auto-complete';
import { PublicacionModel } from '../models/publicacion.model';
import { EventoModel } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class SearchEventService implements AutoCompleteService {

  labelAttribute = 'nombreSearch';

  private eventos:any[] = [];

  constructor( private http: HttpClient ) { }


  obtenerEventos(){
    return this.http.get('https://plogger-437eb.firebaseio.com/evento.json')
    .pipe(
      map( resp=>this.crearArregloEventos(resp) )
    );
  }
  
  private crearArregloEventos(resp){
    if (resp===null||resp===undefined) {return [];}
    //Armo el vector iterable para las publicaciones
    const eventos: any[] = [];
    Object.keys(resp).forEach(key =>{
      
        let evento: any = resp[key];
        evento.id = key;
        evento.search = evento.name + ' ' + evento.startDate + ' ' + evento.ubication;
  
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



  getResults(keyword:string):Observable<any[]> {
    let observable:Observable<any>;

    if (this.eventos.length === 0) {
      observable = this.obtenerEventos();
    } else {
      observable = of(this.eventos);
    }

    return observable.pipe(
      map(
        (result) => {
          return result.filter(
            (item) => {
              return item.search.toLowerCase().includes(
                  keyword.toLowerCase()
              );
            }
          );
        }
      )
    );
  }
}
