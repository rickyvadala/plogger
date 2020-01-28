import { FCM } from '@ionic-native/fcm/ngx';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class notificationPushService {
urlApiFCM ='https://fcm.googleapis.com/fcm/send';
userToken: string;
authHeaders: HttpHeaders

constructor(
    private http: HttpClient) { }


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

}