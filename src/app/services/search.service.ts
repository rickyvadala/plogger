import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import {AutoCompleteService} from 'ionic4-auto-complete';

@Injectable({
  providedIn: 'root'
})
export class SearchService implements AutoCompleteService {

  labelAttribute = 'nombreSearch';

  private perfiles:any[] = [];

  constructor(private http:HttpClient) {

  }
  obtenerPerfiles(){
    return this.http.get('https://plogger-437eb.firebaseio.com/perfil.json')
    .pipe(
      map( resp=>this.crearArregloPerfiles(resp) )
    );
  }
  
  private crearArregloPerfiles(resp){
    if (resp===null||resp===undefined) {return [];}
    //Armo el vector iterable para las publicaciones
    const perfiles:any[] = [];
    Object.keys(resp).forEach(key =>{
        let perfil: any = resp[key];
       perfil.nombreSearch= perfil.nombre + ' ' + perfil.apellido;
        perfiles.unshift(perfil);
    });
    return perfiles;
  }

  getResults(keyword:string):Observable<any[]> {
    let observable:Observable<any>;

    if (this.perfiles.length === 0) {
      observable = this.obtenerPerfiles();
    } else {
      observable = of(this.perfiles);
    }

    return observable.pipe(
      map(
        (result) => {
          return result.filter(
            (item) => {
              return item.nombreSearch.toLowerCase().includes(
                  keyword.toLowerCase()
              );
            }
          );
        }
      )
    );
  }
}
