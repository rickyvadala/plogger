import { Injectable } from '@angular/core';
import { PublicacionModel } from '../models/publicacion.model';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private urlABM = 'https://plogger-437eb.firebaseio.com';

  constructor(private cookies:CookieService,
              private http:HttpClient) { }

  /* 
  Para que estemos en la misma:
  -Los metodos get, delete, push, se hacen una sola vez limpios. 
  y se los llama adentro de el metodo particular que tenga c/u
  -La publicacion en BD va a estar vinculada con el UID de cada usuario y los atributos son
  los del objeto PublicacionModel que esta en models/publicacion.model.ts
  */


  publicacion: PublicacionModel = {
    uid:this.cookies.get('uid'),
    texto: 'ABC',
    fecha:Date.now.toString(),
    foto: '',
    video:'',
    meGusta: {
      uidMegusta:''
    },
    comentarios: {
      uidComentario:'',
      nombreComentario:'',
      apellidoComentario:'',
      fotoComentario:'',
      comentario:'',
      fechaComentario:''
    }
  
  }

  


  guardarPost(){

    return this.http.post(`${this.urlABM}/publicacion.json`, this.publicacion)

    //this.postPublicacion(this.publicacion)
  }




  postPublicacion(publicacion:PublicacionModel) {

  }

}
