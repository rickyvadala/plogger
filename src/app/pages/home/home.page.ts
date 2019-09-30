import { Component, OnInit, ɵConsole } from '@angular/core';

import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

//Send notifications push FCM
import { FCM } from '@ionic-native/fcm/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public options: AutoCompleteOptions;

  public selected: string[] = [];

  constructor( public searchService: SearchService,
                public FCM: FCM,
                public router: Router) {     
  
  }

  ngOnInit() {
    this.FCM.getToken().then(token => {
      console.log(token);
    });
  }

  itemSelected(item: any) {
    this.router.navigate(['/profile', item.uid]);
  }

  goToChat(){
    this.router.navigate(['/message']);
  }

}
