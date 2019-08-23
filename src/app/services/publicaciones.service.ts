import { Injectable } from '@angular/core';
import { PublicacionModel } from '../models/publicacion.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private urlABM = 'https://plogger-437eb.firebaseio.com';

  constructor(private http:HttpClient
              ) { }

  /* 
  Para que estemos en la misma:
  -Los metodos get, delete, push, se hacen una sola vez limpios. 
  y se los llama adentro de el metodo particular que tenga c/u
  -La publicacion en BD va a estar vinculada con el UID de cada usuario y los atributos son
  los del objeto PublicacionModel que esta en models/publicacion.model.ts
  */




  guardarPost(publicacion: PublicacionModel) {
    return this.http.post(`${this.urlABM}/publicacion.json`, publicacion)
    .pipe(
      map( (resp: any) => {
        //debugger;
        console.log(resp);


      })
    );
  }

  


  
}
