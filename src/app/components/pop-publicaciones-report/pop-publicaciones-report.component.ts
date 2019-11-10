import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavParams } from '@ionic/angular';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { PublicacionModel } from 'src/app/models/publicacion.model';
import { DataShareService } from 'src/app/services/data-share.service';

@Component({
  selector: 'app-pop-publicaciones-report',
  templateUrl: './pop-publicaciones-report.component.html',
  styleUrls: ['./pop-publicaciones-report.component.scss'],
})
export class PopPublicacionesReportComponent implements OnInit {

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

  async reportarPublicacion(){
    this.popClick = "reportar";
    this.dataShare.changeMessage(this.popClick);
    this.popoverCtrl.dismiss();
  }

}
