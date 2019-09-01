import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { EventoComponent } from '../../components/evento/evento.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, AfterViewInit {

  misEventos;
  imagen = true;
  @ViewChild('evento') evento: EventoComponent;
  

  constructor(private router: Router,
              private eventService: EventService) { }

  ngOnInit() {
  this.eventService.obtenerEventos().subscribe(resp => { });
  }

  ngAfterViewInit() {
    this.misEventos = this.evento.misEventos;
  }

  newEvent() {
  this.router.navigate(['/event']);
  } 

  segmentChanged(ev: any) {
    this.imagen = false;
    this.misEventos = ev.target.value;
    if (ev.target.value == 'miseventos') {
     this.evento.eventosMios();
    } else {
      this.evento.cargarEventos();
    }
  }
  

}
