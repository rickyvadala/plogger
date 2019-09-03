import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  evento: any;
  eid: string;
  name: string;
  description: string;
  inicio: string;
  fin: string;
  foto: string;
  location: string;
  
  constructor(public route: ActivatedRoute,
              public router: Router) {
     this.evento = this.router.getCurrentNavigation().extras.state;
     this.eid = this.evento.id;
     this.name =  this.evento.name;
     this.description = this.evento.description;
     this.inicio = this.evento.startDate;
     this.fin = this.evento.endDate;
     this.location = this.evento.ubication;
     this.foto = this.evento.foto;
   }

  ngOnInit() {
  }

}
