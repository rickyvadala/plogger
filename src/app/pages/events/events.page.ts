import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  constructor(private router: Router,
              private eventService: EventService) { }

  ngOnInit() {
  this.eventService.obtenerEventos().subscribe(resp => {console.log('resp de eventos',resp);});
  }

  newEvent() {
  this.router.navigate(['/event']);
  } 
  

}
