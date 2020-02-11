import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ComboUbicacionService {

    provinciaSeleccionada: string;

    provinciaSeleccionadaEvent: EventEmitter<any> = new EventEmitter<any>();
    
    constructor() {}

}