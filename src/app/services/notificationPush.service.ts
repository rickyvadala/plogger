import { FCM } from '@ionic-native/fcm/ngx';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NotificacionModel } from '../models/notificaciones.model';

@Injectable({
  providedIn: 'root'
})
export class notificationPushService {
urlApiFCM ='https://fcm.googleapis.com/fcm/send';

private urlABM = 'https://plogger-437eb.firebaseio.com';
userToken: string;
authHeaders: HttpHeaders

constructor(
    private http: HttpClient) { }


sendNotification(description: string, to: string ){
    this._setAuthHeaders();
    const body = {
        "notification":{
            "title"	: "Plogger",
            "body": description
            
        },
        "to" : to
    }
    return this.http.post(this.urlApiFCM, body, {headers: this.authHeaders});
}
private _setAuthHeaders() {
    const userToken = 'key=AAAA12xYLJc:APA91bE7gtZTa_FBULSnGJUmJpDqAGZWb1QA2hWp9_7Q8qTqvPjTGSfbDGbGBJ5xHgUUoCVh-6MFMN38cWSZ3Ims9uA1e3xfkKZhKxXomCKKvd2YfY-iU2jZDtzBS_qL1QFTb6ww5HBY';
    this.authHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': userToken });
  }

  addNotification( key: string, notificacion: NotificacionModel) {
      return this.http.post(this.urlABM + '/perfil/' + key +  '/notificaciones.json', notificacion)
  }

  getNotifications(key: string) {
      console.log(`${this.urlABM}/perfil/${key}/notificaciones.json`);
      return this.http.get(`${this.urlABM}/perfil/${key}/notificaciones.json`).
      pipe(
          map(resp => this.crearArregloNotificaciones(resp))
      )
  }

  private crearArregloNotificaciones(resp) {
      if (resp===null||resp===undefined) {return [];}
      //Armo el vector iterable para las publicaciones
      const notificaciones: any[] = [];
      Object.keys(resp).forEach(key =>{
          let notificacion: any = resp[key];
          notificacion.key=key;
          notificaciones.unshift(notificacion);
      });
      return notificaciones;
  }
}