import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioPloggerService } from '../services/usuario-plogger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: UsuarioPloggerService, private router: Router ) {

  }

  // tslint:disable-next-line: align
  canActivate(): boolean {
      if (this.auth.estaAutenticado() ) {
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
    }
}
