import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { GuardService } from './guard.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public tipoInicio: string;

  usuario: any = {};

  constructor(  private afAuth: AngularFireAuth,
                private router: Router,
                private guard: GuardService ) {

    this.guard.leerToken();

  }

   login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    this.tipoInicio = 'LOGIN FACEBOOK';

    this.afAuth.authState.subscribe( user => {
      
      console.log( 'Estado del usuario: ', user );

      if ( !user ) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.email = user.email;
      this.usuario.foto = user.photoURL;
      this.usuario.token = user.refreshToken;
      this.router.navigate(['/tabs']);
      this.guard.guardarToken(this.usuario.token);
    } );
   }

   logout() {
    console.log("Metodo logout FACEBOOK");
    this.tipoInicio = undefined;
    this.usuario.nombre = undefined;
    this.usuario = {};
    this.afAuth.auth.signOut();
   }
}

