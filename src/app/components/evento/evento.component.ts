import { Component, OnInit, Input } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { EventoModel } from 'src/app/models/evento.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss'],
})
export class EventoComponent implements OnInit {

  eventos : any [] = [];
  private subscripcion: Subscription;

  misEventos: string;

  constructor(private eventService: EventService,
              public router: Router ) {
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.cargarEventos();
  }

  cargarEventos() {
  this.subscripcion =  this.eventService.obtenerEventos()
    .subscribe(respuesta => {
      console.log('resp todos los eventos',respuesta );

      this.eventos = respuesta;
    })
  }

  eventosMios() {
    this.eventService.obtenerMisEventos().subscribe(resp => {
      console.log('resp',resp);
      this.eventos = resp;
    });
  }

  doRefresh( event){
    event.target.complete();
  }

  goToEvent() {
    this.router.navigate(['/event', 12345678]).then();
  }

}
