import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { UsuarioPloggerModel } from '../models/usuario-plogger.model';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private usr:UsuarioPloggerModel;
  private userSource = new BehaviorSubject<UsuarioPloggerModel>(this.usr);
  currentUser = this.userSource.asObservable();

  private messageSource = new BehaviorSubject<string>("Mensaje Default");
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeUser(user: UsuarioPloggerModel) {
    this.userSource.next(user);
  }
}
