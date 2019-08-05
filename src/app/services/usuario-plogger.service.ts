import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioPloggerModel } from '../models/usuario-plogger.model';
import { map } from 'rxjs/operators';
import { GuardService } from './guard.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioPloggerService {

  mail: string;
  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';

  private apikey = 'AIzaSyDdNqooqWdJ7E4nt2KRz-nt2esJ-OmmX54';

  private urlABM = 'https://plogger-437eb.firebaseio.com';

  constructor( private http: HttpClient, 
              public guard: GuardService, 
              public  afAuth: AngularFireAuth,
              private cookies: CookieService  ) {
    this.guard.leerToken();
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
        this.mail = usuario.email;
        const UID = resp.localId;
        console.log(UID);
        this.http.get(`${ this.urlABM }/perfil.json`)
        .subscribe( resp => {
          const array: any[] = Object.values(resp);
          const arrayKeys: any[] = Object.keys(resp);
          for (let index = 0; index < array.length; index++) {
            if (array[index].uid === UID) {
              //Guardo toda la data del usuario en las cookies
              this.cookies.set('UID', UID);
              this.cookies.set('Mail', this.mail);
              this.cookies.set('Usuario', arrayKeys[index]);
              this.cookies.set('TipoInicio', 'p');

              this.cookies.set('Nombre', array[index].nombre);
              this.cookies.set('Apellido', array[index].apellido);
              this.cookies.set('Sexo', array[index].sexo);
              this.cookies.set('FechaNac', array[index].fechaNac);
              this.cookies.set('Foto', array[index].foto);
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
        this.mail = usuario.email;

        this.cookies.set('UID', resp.localId);
        this.cookies.set('TipoInicio', 'p');
        this.cookies.set('Mail', this.mail);

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
        console.log(resp);
        this.cookies.set('Usuario', resp.name)
      })
    );
  }


  editarUsuario (usr) {
    const userCookie = this.cookies.get('Usuario');
    const usrTemp = {
      ...usr
    };

    return this.http.put(`${this.urlABM}/perfil/${userCookie}.json`, usrTemp ).subscribe();

  }

}


