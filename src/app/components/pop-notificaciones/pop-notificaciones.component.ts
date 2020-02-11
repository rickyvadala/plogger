import { Component, OnInit } from '@angular/core';
import { notificationPushService } from '../../services/notificationPush.service';
import {NotificacionModel} from '../../models/notificaciones.model';
import { SearchService } from '../../services/search.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { EventService } from '../../services/event.service';
@Component({
  selector: 'app-pop-notificaciones',
  templateUrl: './pop-notificaciones.component.html',
  styleUrls: ['./pop-notificaciones.component.scss'],
})
export class PopNotificacionesComponent implements OnInit {
  notificaciones: NotificacionModel[];
  usuario: PerfilUsuarioModel;
  getNotificacionSubscription: Subscription

  constructor(private dataShare: DataShareService,
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
      this.notificaciones = resp;
      console.log(this.notificaciones)
      this.notificationPushService.nuevaNotificacionEvent.emit()
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
