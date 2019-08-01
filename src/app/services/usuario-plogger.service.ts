import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioPloggerModel } from '../models/usuario-plogger.model';
import { map } from 'rxjs/operators';
import { GuardService } from './guard.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioPloggerService {

  public tipoInicio: string;

  mail: string;
  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';

  private apikey = 'AIzaSyDdNqooqWdJ7E4nt2KRz-nt2esJ-OmmX54';

  private urlABM = 'https://plogger-437eb.firebaseio.com';

  // userToken: string;

  constructor( private http: HttpClient, public guard: GuardService, public  afAuth: AngularFireAuth  ) {
    this.guard.leerToken();
  }

  logout() {
    this.tipoInicio = undefined;
    this.mail = undefined;
  }

  login( usuario: UsuarioPloggerModel ) {
    const authData = {
      ...usuario, // trae todas las propiedades del UsuarioPlogger
      returnSecureToken: true
    };

    return this.http.
    post(`${ this.url }/verifyPassword?key=${ this.apikey }`,
    authData).pipe(
      map( resp => {
        // tslint:disable-next-line: no-string-literal
        this.guard.guardarToken( resp['idToken'] );
        this.tipoInicio = 'LOGIN PLOGGER';
        this.mail = usuario.email;
        console.log(usuario.email);
        console.log(resp);
        return resp;
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
        this.tipoInicio = 'p';
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

    return this.http.post(`${this.urlABM}/perfil.json`, user);

  }


}


