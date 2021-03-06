import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { GuardService } from './guard.service';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataShareService } from './data-share.service';
 


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
                private http: HttpClient,
                private dataShare: DataShareService) {

    this.guard.leerToken();
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);


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
      //console.log( 'Estado del usuario: ', user );

      if ( !user ) {
     //   console.log('Return');
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
      this.guard.guardarToken(user.refreshToken);



      this.http.get(`${ this.urlABM }/perfil.json`)
      .subscribe( resp => {
        
        const array: any[] = Object.values(resp);
        const arrayKeys: any[] = Object.keys(resp);
        let bandera: boolean = false; 
        for (let index = 0; index < array.length; index++) {
          if (array[index].uid === this.usuario.uid) {
            //Se crea el objeto usuario con mail y nroUsuario
            let nroUsuario = arrayKeys[index];

            this.usuario.key = nroUsuario;
            this.usuario.nombre = array[index].nombre;
            this.usuario.apellido = array[index].apellido;
            this.usuario.uid = array[index].uid;
            this.usuario.mail = array[index].mail;
            this.usuario.foto = array[index].foto;
            this.usuario.sexo =array[index].sexo;
            this.usuario.fechaNac = array[index].fechaNac;
            this.usuario.seguidos = array[index].seguidos;
            this.usuario.seguidores = array[index].seguidores;
     //       console.log("Perfil existente", this.usuario);
            this.router.navigate(['/tabs']);


            this.dataShare.changeUser(this.usuario);
            bandera = true;
            return;
          }
        }
        if (bandera === false) {
          this.crearPerfil(this.usuario).subscribe( user => {
    //        console.log("Crea nuevo perfil",user);
          });
        }
      });






    });
   }

   logout() {
    this.tipoInicio = undefined;
    this.usuario.nombre = undefined;
    this.usuario = {};
    this.afAuth.auth.signOut().then(function() {
    }).catch(function(error) {
    });

   }

   crearPerfil(user: PerfilUsuarioModel) {
    return this.http.post(`${this.urlABM}/perfil.json`, user)
    .pipe(
      map( (resp: any) => {
        let nroUsuario = resp.name;
        this.usuario.key=nroUsuario;
        this.dataShare.changeUser(this.usuario);
        this.router.navigate(['/tabs']);
      })
    );
  }


}

