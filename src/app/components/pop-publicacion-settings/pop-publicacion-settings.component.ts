import { Component, OnInit} from '@angular/core';
import { PopoverController, AlertController, NavParams } from '@ionic/angular';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { PublicacionModel } from 'src/app/models/publicacion.model';
import { DataShareService } from 'src/app/services/data-share.service';

@Component({
  selector: 'app-pop-publicacion-settings',
  templateUrl: './pop-publicacion-settings.component.html',
  styleUrls: ['./pop-publicacion-settings.component.scss'],
})
export class PopPublicacionSettingsComponent implements OnInit {

  passedPublicacion:PublicacionModel;
  popClick:string;




  constructor(private popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private publicarService: PublicacionesService,
              private dataShare: DataShareService) { }

  ngOnInit() {
    this.passedPublicacion = this.navParams.get('publicacion');
    this.dataShare.currentMessage.subscribe( mensaje => this.popClick = mensaje);
  }



  async editarPublicacion() {
    this.popClick = "editar";
    this.dataShare.changeMessage(this.popClick);
    this.popoverCtrl.dismiss();
  }

  async eliminarPublicacion() {
    this.popClick = "borrar";
    this.dataShare.changeMessage(this.popClick);

    this.popoverCtrl.dismiss();
    this.publicarService.borrarPost(this.passedPublicacion).subscribe();
    // const alert = await this.alertCtrl.create({
    //   header: 'Eliminar',
    //   message: 'Realmente desea eliminar esta publicacion?',
    //   // message: 'This is an alert message.',
    //   buttons: [
    //     {
    //       text: 'Cancelar',
    //       role: 'cancel',
    //       cssClass: 'secondary',
    //       handler: (blah) => {
    //         console.log('Confirm Cancel: blah');
    //       }
    //     }, {
    //       text: 'Confirmar',
    //       cssClass: 'danger',
    //       role:'delete',
    //       handler: () => {
    //         console.log(this.passedPublicacion);
    //         this.publicarService.borrarPost(this.passedPublicacion).subscribe();

    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }

}
