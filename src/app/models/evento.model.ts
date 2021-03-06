import { PublicacionModel } from './publicacion.model';
export class EventoModel {
    id?: string;
    uid?: string;
    type: number [];
    name: string;
    description: string;
    ubication: string;
    startDate: string;
    endDate: string;
    foto?: string;
    publicaciones?: PublicacionModel[];
    recorridoDesde?: string;
    recorridoHasta?: string;
}