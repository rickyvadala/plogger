import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioPloggerModel } from '../models/usuario-plogger.model';
import { map } from 'rxjs/operators';
import { GuardService } from './guard.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import * as firebase from 'firebase';
import { DataShareService } from './data-share.service';
import { FCM } from '@ionic-native/fcm/ngx';





@Injectable({
  providedIn: 'root'
})
export class UsuarioPloggerService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';

  private apikey = 'AIzaSyDdNqooqWdJ7E4nt2KRz-nt2esJ-OmmX54';

  private urlABM = 'https://plogger-437eb.firebaseio.com';

  private usuario:PerfilUsuarioModel={};
  
  private token: string;

  constructor( private http: HttpClient, 
              public guard: GuardService, 
              public  afAuth: AngularFireAuth,
              private dataShare: DataShareService,
              private FCM: FCM ) {
    this.guard.leerToken();
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);

  }

  login( usuario: UsuarioPloggerModel ) {
    const authData = {
      ...usuario, // trae todas las propiedades del UsuarioPlogger
      returnSecureToken: true
    };
    this.FCM.getToken().then(token => {
      this.token = token
    })
    return this.http.
    post(`${ this.url }/verifyPassword?key=${ this.apikey }`,
    authData).pipe(
      map( (resp: any) => {
        // tslint:disable-next-line: no-string-literal
        this.guard.guardarToken( resp['idToken'] );
        const mail = usuario.email;
        const UID = resp.localId;
        this.http.get(`${ this.urlABM }/perfil.json`)
        .subscribe( resp => {
          const array: any[] = Object.values(resp);
          const arrayKeys: any[] = Object.keys(resp);
          for (let index = 0; index < array.length; index++) {
            if (array[index].uid === UID) {
              //Se crea el objeto usuario con mail y nroUsuario
              let nroUsuario = arrayKeys[index];
              let objUsuario: PerfilUsuarioModel = {
                key:nroUsuario,
                uid: UID,
                nombre: array[index].nombre,
                apellido: array[index].apellido,
                fechaNac: array[index].fechaNac,
                sexo: array[index].sexo,
                foto: array[index].foto,
                tipoInicio: 'p',
                mail: mail,
                seguidos: array[index].seguidos,
                seguidores: array[index].seguidores,
                eventosMeInteresa: array[index].eventosMeInteresa,
                tipoUsuario: array[index].tipoUsuario,
                descripcion: array[index].descripcion,
                admin: array[index].admin,
                token: this.token,
                ubicacion: array[index].ubicacion,
                notificaciones: array[index].notificaciones,
              }
              this.dataShare.changeUser(objUsuario);
              this.editarUsuario(objUsuario)
              return;
            }
          }
        });
      })
    );
  }

  nuevoUsuarioPlogger( usuario: UsuarioPloggerModel ) {
    const authData = {
      ...usuario, // trae todas las propiedades del UsuarioPlogger
      returnSecureToken: true
    };

    return this.http
    .post(`${ this.url }/signupNewUser?key=${ this.apikey }`,
    authData).pipe(
      map( (resp: any) => {
        // tslint:disable-next-line: no-string-literal
        this.guard.guardarToken( resp['idToken'] );

        let uid = resp.localId;
        let mail = usuario.email;
        let usr:PerfilUsuarioModel = {
          uid: uid,
          mail:mail
        }

        this.dataShare.changeUser(usr);
        return resp;
      })
    );
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  // aca creamos el perfil del usuario en su primer login yo que se

  crearPerfil(user: PerfilUsuarioModel) {
    return this.http.post(`${this.urlABM}/perfil.json`, user)
    .pipe(
      map( (resp: any) => {
        let usuario:PerfilUsuarioModel = user;
        usuario.key = resp.name;
        this.dataShare.changeUser(usuario);
      })
    );
  }

  agregarEventosMeInteresa(eventoId){
    return this.http.get(`${this.urlABM}/perfil/${this.usuario.key}/eventosMeInteresa.json`)
    .pipe(map((x:any) => {
      let meInteresaArray: any[]; 
      if (x!==null) {
        //aca viene cuando ya tiene algun evento en meInteresa
        for (let index = 0; index < x.length; index++) {
          if (x[index]===eventoId) {
            return;
          }
        }
        meInteresaArray = x;
        meInteresaArray.push(eventoId);
        return this.http.put(`${this.urlABM}/perfil/${this.usuario.key}/eventosMeInteresa.json`,meInteresaArray).subscribe();
      } else {
        //aca viene cuando no tiene algun evento en meInteresa
        meInteresaArray = [eventoId]; 
        return this.http.put(`${this.urlABM}/perfil/${this.usuario.key}/eventosMeInteresa.json`, meInteresaArray).subscribe();    
      }
    }));
  }

  eliminarEventoMeInteresa(eventoId) {
    return this.http.get(`${this.urlABM}/perfil/${this.usuario.key}/eventosMeInteresa.json`)
    .pipe(map((x:any) => {
      if (x!==null) {
        for (let index = 0; index < x.length; index++) {
          if (x[index]===eventoId) {
            return this.http.delete(`${ this.urlABM }/perfil/${ this.usuario.key }/eventosMeInteresa/${ index }.json`).subscribe();
          }
        }
      }
    }));

  }

  editarUsuario (usr) {
    const usrTemp = {
      ...usr
    };
    return this.http.put(`${this.urlABM}/perfil/${this.usuario.key}.json`, usrTemp ).subscribe();
  }

  obtenerUsuarioFoto() {
     return this.http.get(`${this.urlABM}/perfil.json`);

  }

  obtenerPerfiles(){
    return this.http.get(`${ this.urlABM }/perfil.json`)
    .pipe(
      map( resp=>this.crearArregloPerfiles(resp) )
    );
  }
  
  private crearArregloPerfiles(resp){
    if (resp===null||resp===undefined) {return [];}
    //Armo el vector iterable para las publicaciones
    const perfiles: PerfilUsuarioModel[] = [];
    Object.keys(resp).forEach(key =>{
        let perfil: PerfilUsuarioModel = resp[key];
        perfil.key=key;
        perfiles.unshift(perfil);
    });
    return perfiles;
  }

}


