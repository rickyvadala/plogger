import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataShareService } from 'src/app/services/data-share.service';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { PublicacionesService } from 'src/app/services/publicaciones.service';

@Component({
  selector: 'app-pop-likes',
  templateUrl: './pop-likes.component.html',
  styleUrls: ['./pop-likes.component.scss'],
})
export class PopLikesComponent implements OnInit {

  passedLikes:any[]=[];
  usuario:PerfilUsuarioModel = {};
  usersLikes:any[]=[];


  constructor(private popoverCtrl: PopoverController,
              private router: Router,
              private dataShare: DataShareService,
              private navParams:NavParams,
              private publicacionesService:PublicacionesService) { }

  ngOnInit() {
    this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
    this.passedLikes = this.navParams.get('likes');
    console.log(this.passedLikes);
    this.publicacionesService.getUserOfLikes(this.passedLikes).subscribe( resp => {
      console.log(resp);
      this.usersLikes=resp;
    });
  }

  volver() {
    this.popoverCtrl.dismiss();
  }

  goToProfileOther(i) {
    this.popoverCtrl.dismiss();
    let otherProfileUid = i;
    console.log(otherProfileUid);
    if (otherProfileUid === this.usuario.key) {
      this.router.navigate(['/tabs/profile']);
     } else {
      this.router.navigate(['/profile', otherProfileUid]);
     }
  }
}
