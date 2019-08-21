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

  usuario: PerfilUsuarioModel = {};

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
        this.usuario.tipoInicio = "g";

     } else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
        this.usuario.tipoInicio = "f";
    }
        this.afAuth.authState.subscribe( user => {      
      console.log( 'Estado del usuario: ', user );

      if ( !user ) {
        console.log('Return');
        return;
      }
      let displayName = user.displayName;
      let nombre = displayName.slice(0, displayName.indexOf(' '));
      let apellido = displayName.slice(displayName.indexOf(' ')+1);
      this.usuario.nombre = nombre;
      this.usuario.apellido = apellido;
      this.usuario.uid = user.uid;
      this.usuario.mail = user.email;
      this.usuario.foto = user.photoURL;
      this.usuario.sexo ="p";
      this.usuario.fechaNac ="";
      this.router.navigate(['/tabs']);
      this.guard.guardarToken(user.refreshToken);




      this.http.get(`${ this.urlABM }/perfil.json`)
      .subscribe( resp => {
        console.log(resp);
        debugger;

        const array: any[] = Object.values(resp);
        const arrayKeys: any[] = Object.keys(resp);
        let bandera: boolean = false; 
        for (let index = 0; index < array.length; index++) {
          debugger;
          if (array[index].uid === this.usuario.uid) {
            //Se crea el objeto usuario con mail y nroUsuario
            let nroUsuario = arrayKeys[index];
            this.usuario.nombre = array[index].nombre;
            this.usuario.apellido = array[index].apellido;
            this.usuario.uid = array[index].uid;
            this.usuario.mail = array[index].mail;
            this.usuario.foto = array[index].foto;
            this.usuario.sexo =array[index].sexo;
            this.usuario.fechaNac = array[index].fechaNac;
            console.log("Perfil existente", this.usuario);

            //Llamo al metodo para guardar cookies
            this.setCookies (this.usuario, nroUsuario);
            bandera = true;
            return;
          }
        }
        if (bandera === false) {
          this.crearPerfil(this.usuario).subscribe( user => {
            console.log("Crea nuevo perfil",user);
          });
        }
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
    this.cookies.set('TipoInicio', objUsuario.tipoInicio);
    this.cookies.set('Nombre', objUsuario.nombre);
    this.cookies.set('Apellido', objUsuario.apellido);
    this.cookies.set('Sexo', objUsuario.sexo);
    this.cookies.set('FechaNac', objUsuario.fechaNac);
    this.cookies.set('Foto', objUsuario.foto);
    this.cookies.set('Mail', objUsuario.mail);
}
}

