import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataShareService } from 'src/app/services/data-share.service';

@Component({
  selector: 'app-pop-evento-settings',
  templateUrl: './pop-evento-settings.component.html',
  styleUrls: ['./pop-evento-settings.component.scss'],
})
export class PopEventoSettingsComponent implements OnInit {

  popClick:string;  

  constructor( private popoverCtrl: PopoverController,
              private dataShare: DataShareService ) {}

  ngOnInit() {
  }

  
  async eliminarEvento() {
    this.popClick = "borrar";
    this.dataShare.changeMessage(this.popClick);
    this.popoverCtrl.dismiss();
  }
  async editarEvento() {
    this.popClick = "editar";
    this.dataShare.changeMessage(this.popClick);
    this.popoverCtrl.dismiss();
  }

}
