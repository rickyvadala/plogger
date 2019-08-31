import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioPloggerModel } from '../models/usuario-plogger.model';
import { map } from 'rxjs/operators';
import { GuardService } from './guard.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
//import { CookieService } from 'ngx-cookie-service';
import * as firebase from 'firebase';
import { DataShareService } from './data-share.service';





@Injectable({
  providedIn: 'root'
})
export class UsuarioPloggerService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';

  private apikey = 'AIzaSyDdNqooqWdJ7E4nt2KRz-nt2esJ-OmmX54';

  private urlABM = 'https://plogger-437eb.firebaseio.com';

  private usuario:PerfilUsuarioModel={};

  constructor( private http: HttpClient, 
              public guard: GuardService, 
              public  afAuth: AngularFireAuth,
              //private cookies: CookieService,
              private dataShare: DataShareService ) {
    this.guard.leerToken();
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);

  }

  login( usuario: UsuarioPloggerModel ) {
    const authData = {
      ...usuario, // trae todas las propiedades del UsuarioPlogger
      returnSecureToken: true
    };

    return this.http.
    post(`${ this.url }/verifyPassword?key=${ this.apikey }`,
    authData).pipe(
      map( (resp: any) => {
        // tslint:disable-next-line: no-string-literal
        this.guard.guardarToken( resp['idToken'] );
        const mail = usuario.email;
        const UID = resp.localId;
        console.log(UID);
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
                mail: mail
              }
              //Llamo al metodo para guardar cookies
              this.dataShare.changeUser(objUsuario);
              //this.setCookies (objUsuario, nroUsuario);
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

        //this.cookies.set('UID', resp.localId);
        //this.cookies.set('Mail', mail);

        return resp;
      })
    );
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  // aca creamos el perfil del usuario en su primer login yo que se

  crearPerfil(user: PerfilUsuarioModel) {
    console.log(user);
    return this.http.post(`${this.urlABM}/perfil.json`, user)
    .pipe(
      map( (resp: any) => {
        console.log(resp);
        let usuario:PerfilUsuarioModel = user;
        usuario.key = resp.name;
        //this.setCookies(user,nroUsuario)
        this.dataShare.changeUser(usuario);
      })
    );
  }


  editarUsuario (usr) {
    //const userCookie = this.cookies.get('Usuario');

    const usrTemp = {
      ...usr
    };
    return this.http.put(`${this.urlABM}/perfil/${this.usuario.key}.json`, usrTemp ).subscribe();
  }


  // setCookies (objUsuario, nroUsuario) {
  //     //Guardo toda la data del usuario en las cookies
  //     this.cookies.set('Usuario', nroUsuario);
  //     this.cookies.set('UID', objUsuario.uid);
  //     this.cookies.set('TipoInicio', 'p');
  //     this.cookies.set('Nombre', objUsuario.nombre);
  //     this.cookies.set('Apellido', objUsuario.apellido);
  //     this.cookies.set('Sexo', objUsuario.sexo);
  //     this.cookies.set('FechaNac', objUsuario.fechaNac);
  //     this.cookies.set('Foto', objUsuario.foto);
  //     this.cookies.set('Mail', objUsuario.mail);
  // }

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
        perfiles.unshift(perfil);
    });
    return perfiles;
  }

}


