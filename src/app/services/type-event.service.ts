import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import {AutoCompleteService} from 'ionic4-auto-complete';

@Injectable({
  providedIn: 'root'
})
export class TypeEventService implements AutoCompleteService {
  labelAttribute = 'buscarTipo';

  private eventos:any[] = [];

  constructor( private http: HttpClient ) { }


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



  getResults(keyword:string):Observable<any[]> {
    let observable:Observable<any>;

    if (this.eventos.length === 0) {
      observable = this.obtenerTipoEventos();
    } else {
      observable = of(this.eventos);
    }

    return observable.pipe(
      map(
        (result) => {
    
          return result.filter(
            (item) => {
              return item.buscarTipo.toLowerCase().includes(
                  keyword.toLowerCase()
              );
            }
          );
        }
      )
    );
  }
}
