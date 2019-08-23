import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopPublicacionSettingsComponent } from '../pop-publicacion-settings/pop-publicacion-settings.component';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.scss'],
})
export class PublicacionComponent implements OnInit {

  foto = "../../../assets/img/default-user.png";
  nombre = "Nombre Harcodeado";
  imagenPublicacion = "../../../assets/shapes.svg";

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  async mostrarPop(evento) {
    const popover = await this.popoverCtrl.create({
      component: PopPublicacionSettingsComponent,
      event: evento,
      mode: 'ios'
    });
    await popover.present();
  }

  meGusta(){

  }

  comentar(){

  }

  confirmarComentario() {

  }

  compartir() {

  }

}
