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

  public usuario: any = {};

  constructor(  public afAuth: AngularFireAuth,
                public router: Router,
                public guard: GuardService ) {

    this.guard.leerToken();

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
      this.tipoInicio = 'f';

    } );
  }

   login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    console.log(this.usuario.token);
   }

   logout() {
     this.usuario = {};
     this.afAuth.auth.signOut();
   }
}

