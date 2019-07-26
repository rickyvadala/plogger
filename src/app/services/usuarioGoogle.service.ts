import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { GuardService } from './guard.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceGoogle {
  public tipoInicio: string;

  usuario: any = {};

  constructor(  private afAuth: AngularFireAuth,
                private router: Router,
                private guard: GuardService ) {    
    
    this.guard.leerToken();
  }

   login() {
     this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
     this.tipoInicio = 'LOGIN GOOGLE';
     this.afAuth.authState.subscribe( user => {
       console.log(user);
      if ( !user ) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.email = user.email;
      this.usuario.foto = user.photoURL;
      this.usuario.token = user.refreshToken;
      console.log(this.usuario.token);
      this.router.navigate(['/tabs']);
      this.guard.guardarToken(this.usuario.token);
    } );
   }

  logout() {
    console.log("Metodo logout GOOGLE");
    this.usuario = {};
    this.afAuth.auth.signOut();
    this.tipoInicio = undefined;
    this.usuario.nombre = undefined;

  }
}

