import { Component, OnInit, ɵConsole, ViewChild } from '@angular/core';

import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

//Send notifications push FCM
//import { FCM } from '@ionic-native/fcm/ngx';


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


  constructor( public searchService: SearchService,
                //public FCM: FCM,
                public router: Router) {     
  
  }

  ngOnInit() {
    // this.FCM.getToken().then(token => {
    //   console.log(token);
    // });
    this.primerIngreso = true;
  }

  ionViewWillEnter(){
    if (this.primerIngreso != true) {
      this.publicaciones.ngOnInit();
    } else this.primerIngreso = false
  }
  ionViewWillLeave (){
    this.publicaciones.publicaciones = [];
  }

  itemSelected(item: any) {
    this.router.navigate(['/profile', item.uid]);
  }

  goToChat(){
    this.router.navigate(['/message']);
  }

}
