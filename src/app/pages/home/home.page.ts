import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';

import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

//Send notifications push FCM
import { FCM } from '@ionic-native/fcm/ngx';
import { notificationPushService } from '../../services/notificationPush.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { UsuarioPloggerService } from 'src/app/services/usuario-plogger.service';
import { DataShareService } from 'src/app/services/data-share.service';
import { NotificacionModel } from 'src/app/models/notificaciones.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('publicacionesHome') publicaciones;

  public options: AutoCompleteOptions;

  public selected: string[] = [];
  primerIngreso = true;
  token: string;
  usuario: PerfilUsuarioModel;
  notificaciones: NotificacionModel[];


  constructor(public searchService: SearchService,
    public FCM: FCM,
    public router: Router,
    public notificationPushService: notificationPushService,
    private authPlogger: UsuarioPloggerService,
    private dataShare: DataShareService
  ) {

    this.dataShare.currentUser.subscribe(usuario => {
      this.usuario = usuario
      this.notificationPushService.getNotifications(this.usuario.key).subscribe(resp => {
        this.notificaciones = resp
      })
    });
  }

  ngOnInit() {

    this.primerIngreso = true;

    // this.FCM.getToken().then(token => {
    //   this.token = token
    // })
    // const usuario: PerfilUsuarioModel ={
    //   token: this.token
    // }
    // this.authPlogger.editarUsuario(usuario);
  }

  ionViewWillEnter() {
    if (this.primerIngreso != true) {
      this.publicaciones.ngOnInit();
    } else this.primerIngreso = false
  }
  ionViewWillLeave() {
    this.publicaciones.publicaciones = [];
  }

  itemSelected(item: any) {
    this.router.navigate(['/profile', item.uid]);
  }

  goToChat() {
    this.router.navigate(['/message']);
  }

}
