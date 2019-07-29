import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { GuardService } from './guard.service';
import { CookieService } from 'ngx-cookie-service';
 


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public tipoInicio: string;

  usuario: any = {};

  constructor(  private afAuth: AngularFireAuth,
                private router: Router,
                private guard: GuardService,
                private cs: CookieService ) {
                  
    this.afAuth.authState.subscribe( user => {
      
      console.log( 'Estado del usuario: ', user );

      if ( !user ) {
        console.log('Return');
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.email = user.email;
      this.usuario.foto = user.photoURL;
      this.usuario.token = user.refreshToken;
      this.router.navigate(['/tabs']);
      this.guard.guardarToken(this.usuario.token);
      console.log('NOOO Return');

    } );

    this.guard.leerToken();

  }

   login(proveedor: string) {
     if (proveedor==="google") {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
     } else {
      this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
     }
    
   }

   logout() {
    console.log("Metodo logout");
    this.tipoInicio = undefined;
    this.usuario.nombre = undefined;
    this.usuario = {};
    this.afAuth.auth.signOut();
    // this.cs.delete('NID');
    // this.cs.delete('c_user');
    // this.cs.delete('datr');
    // this.cs.delete('fr');
    // this.cs.delete('sb');
    // this.cs.delete('spin');
    // this.cs.delete('wd');
    // this.cs.delete('xs');
    // this.cs.deleteAll();
   }


}

