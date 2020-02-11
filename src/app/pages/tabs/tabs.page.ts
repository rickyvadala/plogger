import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  event: boolean = false;


  constructor(public router: Router) {
  }

  eventClick(event) {
    this.event = true;
  }

  homeClick(event) {
    this.event = false;
  }

  profileClick(event) {
    this.event = false;
  }
}
