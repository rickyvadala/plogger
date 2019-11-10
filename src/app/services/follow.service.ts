import { Injectable } from '@angular/core';
import { DataShareService } from './data-share.service';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private urlABM = 'https://plogger-437eb.firebaseio.com';
  usuario:PerfilUsuarioModel={};

  constructor(private http: HttpClient,
              private dataShare: DataShareService) { 
                this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
              }

  follow(keyOther){
    // Obtiene los seguidos
    return this.http.get(`${ this.urlABM }/perfil/${ this.usuario.key }/seguidos.json`)
    .pipe(map((x:any) => {
      //En esta parte cargo en seguidos del usuario que sigue
      let seguidosArray: any[]; 
      if (x!==null) {
        //aca viene cuando ya sigue a otros usuarios
        for (let index = 0; index < x.length; index++) {
         
          if (x[index]===this.usuario.uid) {
            return;
          }
        }
        seguidosArray = x;
        seguidosArray.push(keyOther);
        return this.http.put(`${ this.urlABM }/perfil/${ this.usuario.key }/seguidos.json`,seguidosArray).subscribe(resp =>{
          this.usuario.seguidos=seguidosArray;
          this.dataShare.changeUser(this.usuario)
          this.cargarEnSeguidores(keyOther).subscribe();
        });
      } else {
        console.log(keyOther);
        //aca viene cuando es el primer usuario que sigue
        seguidosArray = [keyOther]; 
        return this.http.put(`${ this.urlABM }/perfil/${ this.usuario.key }/seguidos.json`,seguidosArray).subscribe(resp =>{
          this.usuario.seguidos=seguidosArray;
          this.dataShare.changeUser(this.usuario);
          //En esta parte cargo en seguidores al usuario que se acaba de seguir
          this.cargarEnSeguidores(keyOther).subscribe();
        });
      }
    }));
  } 

  cargarEnSeguidores(keyOther) {
    return this.http.get(`${ this.urlABM }/perfil/${ keyOther }/seguidores.json`)
    .pipe(map((x:any) => {
      let seguidoresArray: any[]; 
      if (x!==null) {
        //aca viene cuando ya es seguido por otros usuarios
        for (let index = 0; index < x.length; index++) {
          if (x[index]===this.usuario.uid) {
            return;
          }
        }
        seguidoresArray = x;
        seguidoresArray.push(this.usuario.key);
        return this.http.put(`${ this.urlABM }/perfil/${ keyOther}/seguidores.json`,seguidoresArray).subscribe();
      } else {
        //aca viene cuando es el primer usuario que sigue
        seguidoresArray = [this.usuario.key]; 
        return this.http.put(`${ this.urlABM }/perfil/${ keyOther}/seguidores.json`,seguidoresArray).subscribe();
      }
    }));
  }

  unfollow(keyOther) {
    // Obtiene los seguidos
    return this.http.get(`${ this.urlABM }/perfil/${ this.usuario.key }/seguidos.json`)
    .pipe(map((x:any) => {
      if (x!==null) {
        for (let index = 0; index < x.length; index++) {
          if (x[index]===keyOther) {
            return this.http.delete(`${ this.urlABM }/perfil/${ this.usuario.key }/seguidos/${ index }.json`).subscribe(resp =>{
              this.borrarDeSeguidores(keyOther).subscribe();
            });
          }
        }
      }
    }));
  }

  borrarDeSeguidores(keyOther) {
    // Obtiene los seguidos
    return this.http.get(`${ this.urlABM }/perfil/${ keyOther }/seguidores.json`)
    .pipe(map((x:any) => {
      if (x!==null) {
        for (let index = 0; index < x.length; index++) {
          if (x[index]===this.usuario.key) {
            return this.http.delete(`${ this.urlABM }/perfil/${ keyOther }/seguidores/${ index }.json`).subscribe();
          }
        }
      }
    }));
  }

  getUserOfData(users:any[]) {
    return this.http.get(`${ this.urlABM }/perfil.json`)
    .pipe(
      map( resp=>this.crearArregloData(resp,users))
    );  
  }
    
    private crearArregloData(resp,users){
      const usersArray: any[] = [];
      if (resp===null||resp===undefined) {return [];}
      Object.keys(resp).forEach(key =>{
        for (let index = 0; index < users.length; index++) {
          if (key===users[index]) {
            let objeto = {
              nombre: resp[key].nombre,
              apellido: resp[key].apellido,
              foto: resp[key].foto,
              uid: key
            }
            usersArray.unshift(objeto);
          }
        }
      });
      return usersArray; 
    }

}
