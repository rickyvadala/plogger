import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private usr:PerfilUsuarioModel;
  private userSource = new BehaviorSubject<PerfilUsuarioModel>(this.usr);
  currentUser = this.userSource.asObservable();

  private messageSource = new BehaviorSubject<string>("Mensaje Default");
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeUser(user: PerfilUsuarioModel) {
    this.userSource.next(user);
  }
}
