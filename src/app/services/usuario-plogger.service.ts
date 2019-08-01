import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioPloggerModel } from '../models/usuario-plogger.model';
import { map } from 'rxjs/operators';
import { GuardService } from './guard.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { CookieService } from 'ngx-cookie-service';
import { disableDebugTools } from '@angular/platform-browser';


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
              this.cookies.set('Usuario', arrayKeys[index]);
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
      map( resp => {
        // tslint:disable-next-line: no-string-literal
        this.guard.guardarToken( resp['idToken'] );
        this.mail = usuario.email;
        console.log(resp);
        console.log(this.mail);
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


}


