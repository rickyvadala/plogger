import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { EventoModel } from 'src/app/models/evento.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss'],
})
export class EventoComponent implements OnInit {
  eventos : any [] = [];
  private subscripcion: Subscription;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.cargarEventos();
    
  }

  ionViewWillEnter() {
    this.cargarEventos();
  }

  cargarEventos() {
  this.subscripcion =  this.eventService.obtenerEventos()
    .subscribe(respuesta => {
      this.eventos = respuesta;
      console.log('eventos: ',this.eventos);
    })
  }





}
