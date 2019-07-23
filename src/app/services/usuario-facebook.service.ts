import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: any = {};

  constructor( public afAuth: AngularFireAuth ) {

    this.afAuth.authState.subscribe( user => {

      console.log( 'Estado del usuario: ', user );

      if ( !user ) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.email = user.email;
      this.usuario.foto = user.photoURL;

    } );
  }

   login() {
     this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
   }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }
}

