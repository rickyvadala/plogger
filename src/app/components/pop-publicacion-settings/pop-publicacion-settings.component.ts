import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pop-publicacion-settings',
  templateUrl: './pop-publicacion-settings.component.html',
  styleUrls: ['./pop-publicacion-settings.component.scss'],
})
export class PopPublicacionSettingsComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController,
              private alertCtrl: AlertController) { }

  ngOnInit() {}

  editarPublicacion() {
    this.popoverCtrl.dismiss();
  }

  async eliminarPublicacion() {
    this.popoverCtrl.dismiss();
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: 'Realmente desea eliminar esta publicacion?',
      // message: 'This is an alert message.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Okay');
            //Aca deberias llamar al metodo eliminar luki
          }
        }
      ]
    });

    await alert.present();
  }

}
