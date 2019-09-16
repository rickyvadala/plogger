import { Component, OnInit } from '@angular/core';

import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public options: AutoCompleteOptions;

  public selected: string[] = [];

  constructor( public searchService: SearchService,
                public router: Router) {     
  
  }

  ngOnInit() {
  }

  itemSelected(item: any) {
    this.router.navigate(['/profile', item.uid]);
  }

}
