import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { PerfilUsuarioModel } from 'src/app/models/perfil-usuario.model';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-pop-follow',
  templateUrl: './pop-follow.component.html',
  styleUrls: ['./pop-follow.component.scss'],
})
export class PopFollowComponent implements OnInit {

  passedData:any;
  users:any[]=[];


  constructor(private popoverCtrl:PopoverController,
              private router: Router,
              private navParams: NavParams,
              private followService: FollowService) { }

  ngOnInit() {
    this.passedData = this.navParams.get('data');
    if (this.passedData===undefined) {
      return
    }
    this.followService.getUserOfData(this.passedData).subscribe( resp => {
     // console.log(resp);
      this.users=resp;
    });
  }

  volver() {
    this.popoverCtrl.dismiss();
  }

  goToProfileOther(i) {
    console.log(i);
    this.popoverCtrl.dismiss();
    let otherProfileUid = i;
    this.router.navigate(['/profile', otherProfileUid]);
  }

}
