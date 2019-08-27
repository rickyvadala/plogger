import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavParams } from '@ionic/angular';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { PublicacionModel } from 'src/app/models/publicacion.model';

@Component({
  selector: 'app-pop-publicacion-settings',
  templateUrl: './pop-publicacion-settings.component.html',
  styleUrls: ['./pop-publicacion-settings.component.scss'],
})
export class PopPublicacionSettingsComponent implements OnInit {

  passedPublicacion:PublicacionModel;
  constructor(private popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private publicarService: PublicacionesService) { }

  ngOnInit() {
    this.passedPublicacion = this.navParams.get('publicacion');
  }

  async editarPublicacion() {
    this.popoverCtrl.dismiss();
    const alert = await this.alertCtrl.create({
      header: 'Editar',
      message: 'Realmente desea editar esta publicacion?',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Texto'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          role: 'delete',
          handler: (data) => {
            console.log(data.name1);
            if (data.name1==="") {
              console.log("ingresa algo cagon");
            } else {
              
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarPublicacion() {
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
    //         debugger;
    //         this.publicarService.borrarPost(this.passedPublicacion).subscribe();

    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }

}
