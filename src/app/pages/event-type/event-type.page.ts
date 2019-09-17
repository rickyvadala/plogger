import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoModel } from 'src/app/models/evento.model';
import { EventoComponent } from 'src/app/components/evento/evento.component';


@Component({
  selector: 'app-event-type',
  templateUrl: './event-type.page.html',
  styleUrls: ['./event-type.page.scss'],
})
export class EventTypePage implements OnInit {

  eventos : any [] = [];
  private subscripcion: Subscription;
  idTipo: number;
  nombreTipoEvento: string;
  
  @ViewChild('evento') evento: EventoComponent;


  constructor(public router: Router,
              public route: ActivatedRoute) { 

   this.idTipo = this.route.snapshot.params['id'];
   this.nombreTipoEvento = this.router.getCurrentNavigation().extras.state.label;
  }
              
  ngOnInit() {
    this.evento.obtenerEventosPorTipo(this.idTipo);
  }
  
    goToEvent(i) {
      let eid = this.eventos[i].id;
      this.router.navigate([`/event/${eid}`],  {state:  this.eventos[i]} );
    }

}
