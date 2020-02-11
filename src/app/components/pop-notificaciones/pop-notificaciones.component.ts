import { Component, OnInit } from '@angular/core';
import { notificationPushService } from '../../services/notificationPush.service';
import {NotificacionModel} from '../../models/notificaciones.model';
import { SearchService } from '../../services/search.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

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
        public router: Router,  private popoverCtrl: PopoverController
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
    this.notificationPushService.cargarNotificaciones(this.usuario.key).subscribe((resp) => {
    this.notificaciones = resp.map((x) => {
          return {
            key: x.key,
            descripcion: x.descripcion,
            remitente: x.remitente,
            tipo: x.tipo,
            keyOther: x.keyOther ? x.keyOther : null,
            eventKey: x.eventKey ? x.eventKey : null,
            date: new Date(x.date)
          }
       })
       this.notificaciones.sort((a,b) =>  b.date - a.date)
    })

  }

  goToNotification(item) {
    switch (item.tipo) {
      case 'nuevoSeguidor':
        this.router.navigate(['/profile', item.keyOther]);
        this.popoverCtrl.dismiss();
        break;

      case 'invitacionEvento':
        let evento = {
          id: item.eventKey
        }
        this.router.navigate([`/event/${item.eventKey}`],  {state: evento} );
        this.popoverCtrl.dismiss();
        break;
    
      default:
        break;
    }

  }


}
