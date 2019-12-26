import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoModel } from 'src/app/models/evento.model';
import { EventoComponent } from 'src/app/components/evento/evento.component';
import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { SearchService } from 'src/app/services/search.service';
import { SearchEventService } from 'src/app/services/search-event.service';
import { SearchTypeEventService } from 'src/app/services/search-type-event.service';



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
  public options: AutoCompleteOptions;
  public selected: string[] = [];


  
  @ViewChild('evento') evento: EventoComponent;


  constructor(public router: Router,
              public route: ActivatedRoute,
              public searchService: SearchTypeEventService) { 

   this.idTipo = this.route.snapshot.params['id'];

   this.nombreTipoEvento = this.router.getCurrentNavigation().extras.state.label;
  }
              
  ngOnInit() {
    this.evento.obtenerEventosPorTipo(this.idTipo);
  //hacer un viewchild o algo de eso
   this.searchService.idTipo = this.idTipo;
  
  this.searchService.obtenerEventos().subscribe();
  }


  
    goToEvent(i) {
      let eid = this.eventos[i].id;
      this.router.navigate([`/event/${eid}`],  {state:  this.eventos[i]} );
    }

    itemSelected(item: any) {
      this.router.navigate(['/event', item.id], {state:  item});
    }

}
