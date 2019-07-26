import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceGoogle {

  public usuario: any = {};

  constructor( public afAuth: AngularFireAuth,
                private router: Router ) {

    this.afAuth.authState.subscribe( user => {

      console.log( 'Estado del usuario: ', user );

      if ( !user ) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.email = user.email;
      this.usuario.foto = user.photoURL;
      this.router.navigate(['/profile']);


    } );
  }

   login() {
     this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
   }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }
}

