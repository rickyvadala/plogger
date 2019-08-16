import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { GuardService } from './guard.service';
import { CookieService } from 'ngx-cookie-service';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
 


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlABM = 'https://plogger-437eb.firebaseio.com';

  public tipoInicio: string;

  usuario: any = {};

  constructor(  private afAuth: AngularFireAuth,
                private router: Router,
                private guard: GuardService,
                private cookies: CookieService,
                private http: HttpClient) {

    this.guard.leerToken();

  }

   login(proveedor: string) {
     if (proveedor==="google") {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
     } else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }
        this.afAuth.authState.subscribe( user => {      
      console.log( 'Estado del usuario: ', user );

      if ( !user ) {
        console.log('Return');
        return;
      }
      debugger;
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.email = user.email;
      this.usuario.foto = user.photoURL;
      this.usuario.token = user.refreshToken;
      this.router.navigate(['/tabs']);
      this.guard.guardarToken(this.usuario.token);

      this.crearPerfil(this.usuario).subscribe( user => {
        console.log("Subscribe de crear perfil",user);
      });
    });

   }

   logout() {
    console.log("Metodo logout");
    this.tipoInicio = undefined;
    this.usuario.nombre = undefined;
    this.usuario = {};
    this.afAuth.auth.signOut().then(function() {
      console.log("Cerro correctamente");
    }).catch(function(error) {
      console.log(error);
    });

   }

   crearPerfil(user: PerfilUsuarioModel) {
    debugger;
    console.log(user);
    return this.http.post(`${this.urlABM}/perfil.json`, user)
    .pipe(
      map( (resp: any) => {
        console.log(resp);
        let nroUsuario = resp.name;
        this.setCookies(user,nroUsuario)

      })
    );
  }

  setCookies (objUsuario, nroUsuario) {
    //Guardo toda la data del usuario en las cookies
    this.cookies.set('Usuario', nroUsuario);
    this.cookies.set('UID', objUsuario.uid);
    this.cookies.set('TipoInicio', 'p');
    this.cookies.set('Nombre', objUsuario.nombre);
    this.cookies.set('Apellido', objUsuario.apellido);
    this.cookies.set('Sexo', objUsuario.sexo);
    this.cookies.set('FechaNac', objUsuario.fechaNac);
    this.cookies.set('Foto', objUsuario.foto);
    this.cookies.set('Mail', objUsuario.mail);
}
}

