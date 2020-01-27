import { Component, OnInit} from '@angular/core';
import { ComboUbicacionService } from '../../services/combo-ubicacion.service';

@Component({
  selector: 'combo-ubicacion',
  templateUrl: './combo-ubicacion.component.html',
  styleUrls: ['./combo-ubicacion.component.scss'],
})

export class ComboUbicacionComponent implements OnInit { 

    constructor( private comboUbicacionService: ComboUbicacionService ) {}

    ngOnInit() {}

    onSelectChange(event) {
      this.comboUbicacionService.provinciaSeleccionada = event.target.value;
    }

}