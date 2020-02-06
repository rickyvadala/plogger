import { Component, OnInit } from '@angular/core';
import { notificationPushService } from '../../services/notificationPush.service';
import {NotificacionModel} from '../../models/notificaciones.model';
import { SearchService } from '../../services/search.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pop-notificaciones',
  templateUrl: './pop-notificaciones.component.html',
  styleUrls: ['./pop-notificaciones.component.scss'],
})
export class PopNotificacionesComponent implements OnInit {
  notificaciones: NotificacionModel[];
  usuario: PerfilUsuarioModel;
  getNotificacionSubscription: Subscription

  constructor(     private dataShare: DataShareService,
       public notificationPushService: notificationPushService,
    )
     {

      this.getNotificacionSubscription = this.notificationPushService.getNotificacionEvent.subscribe(() => {
        this.getNotifications();
      })
      
      this.dataShare.currentUser.subscribe(usuario => {
        this.usuario = usuario
        this.getNotifications()
      });
   }

  ngOnInit() {}

  getNotifications() {
    console.log('getNotifications')
    this.notificationPushService.cargarNotificaciones(this.usuario.key).subscribe((resp) => {
      this.notificaciones = resp;
      console.log(this.notificaciones);
    })

  }

  goToNotification(item) {
    console.log(item)
    
  }


}
