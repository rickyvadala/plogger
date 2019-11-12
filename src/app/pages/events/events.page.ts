import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { EventoComponent } from '../../components/evento/evento.component';
import { SearchEventService } from '../../services/search-event.service';
import { TypeEventService } from 'src/app/services/type-event.service';
import { ModalController } from '@ionic/angular';
import { MisEventosPage } from '../mis-eventos/mis-eventos.page';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, AfterViewInit {

  public selected: string = '';

  misEventos;
  tiposEventos: any[] = [];
  imagen = true;
  eid: string;
  @ViewChild('evento') evento: EventoComponent;
  
  

  constructor(private router: Router,
              private eventService: EventService,
              public searchService: SearchEventService,
              private modalCtrl: ModalController,
              ) { 
              }

  ngOnInit() {
  this.eventService.obtenerEventos().subscribe(resp => { });
  this.eventService.obtenerTipoEventos().subscribe(resp => { 
    this.tiposEventos = resp;
    this.tiposEventos = this.tiposEventos.sort((a, b)=> (a.order-b.order)) });
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
    if (ev.target.value == 'eventos') {
     this.evento.eventosEnProceso();
    } else {
      if (ev.target.value == 'miseventos'){
      this.evento.obtenerMisEventos();
      }else {
        this.evento.eventosFinalizados();
      }
    }
  }

  itemSelected(item: any) {
    this.router.navigate(['/event', item.id], {state:  item});
  }

  goToEventType(id: number, tipo) {
  this.router.navigate(['/event-type', id], {state: tipo});
  }


}
