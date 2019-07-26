import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioPloggerModel } from '../models/usuario-plogger.model';
import { map } from 'rxjs/operators';
import { GuardService } from './guard.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioPloggerService {

  public tipoInicio: string;

  mail: string;
  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';

  private apikey = 'AIzaSyADjXkXnSklUgJq9vFZzH6razPr2XiRz6Q';

  // userToken: string;

  constructor( private http: HttpClient, public guard: GuardService ) {
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
}


