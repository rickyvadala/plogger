import { Injectable } from '@angular/core';
import { PublicacionModel } from '../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  constructor() { }

  /* 
  Para que estemos en la misma:
  -Los metodos get, delete, push, se hacen una sola vez limpios. 
  y se los llama adentro de el metodo particular que tenga c/u
  -La publicacion en BD va a estar vinculada con el UID de cada usuario y los atributos son
  los del objeto PublicacionModel que esta en models/publicacion.model.ts
  */

  publicacion: PublicacionModel = {
    
  }
}
