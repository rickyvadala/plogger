import { FCM } from '@ionic-native/fcm/ngx';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NotificacionModel } from '../models/notificaciones.model';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class notificationPushService {
urlApiFCM ='https://fcm.googleapis.com/fcm/send';

private urlABM = 'https://plogger-437eb.firebaseio.com';
userToken: string;
authHeaders: HttpHeaders;

private itemsCollection: AngularFirestoreCollection<NotificacionModel>;

notifiaciones: NotificacionModel[];

getNotificacionEvent: EventEmitter<NotificacionModel> = new EventEmitter<NotificacionModel>()

constructor(
    private http: HttpClient,  private afs: AngularFirestore) { }


sendNotification(description: string, to: string ){
    if (to) {
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
    return
}
private _setAuthHeaders() {
    const userToken = 'key=AAAA12xYLJc:APA91bE7gtZTa_FBULSnGJUmJpDqAGZWb1QA2hWp9_7Q8qTqvPjTGSfbDGbGBJ5xHgUUoCVh-6MFMN38cWSZ3Ims9uA1e3xfkKZhKxXomCKKvd2YfY-iU2jZDtzBS_qL1QFTb6ww5HBY';
    this.authHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': userToken });
  }

  cargarNotificaciones(key: string) {
    this.itemsCollection = this.afs.collection<NotificacionModel>(`notificaciones${key}`);

    return this.itemsCollection.valueChanges().pipe(
      map((notificaciones: NotificacionModel[]) => {
        this.notifiaciones = notificaciones;
        return this.notifiaciones;
      }
      ))
  }

  agregarNotificacion(notificacion: NotificacionModel) {
    this.itemsCollection = this.afs.collection<NotificacionModel>(`notificaciones${notificacion.key}`);
    let data: any = {
        key: notificacion.key,
        descripcion: notificacion.descripcion,
        remitente: notificacion.remitente,
        tipo: notificacion.tipo,
        keyOther: notificacion.keyOther,
        date: new Date()
    }
    return this.itemsCollection.add(data);
  }

  agregarNotificacionLikeYComentario(notificacion: NotificacionModel) {
    this.itemsCollection = this.afs.collection<NotificacionModel>(`notificaciones${notificacion.key}`);
    let data: any = {
        key: notificacion.key,
        descripcion: notificacion.descripcion,
        remitente: notificacion.remitente,
        tipo: notificacion.tipo,
        date: new Date()
    }
    return this.itemsCollection.add(data);
  }

  agregarNotificacionEvento(notificacion: NotificacionModel) {
    this.itemsCollection = this.afs.collection<NotificacionModel>(`notificaciones${notificacion.key}`);
    let data: any = {
        key: notificacion.key,
        descripcion: notificacion.descripcion,
        remitente: notificacion.remitente,
        tipo: notificacion.tipo,
        eventKey: notificacion.eventKey,
        date: new Date()
    }
    return this.itemsCollection.add(data);
  }
}