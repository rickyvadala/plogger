import { Injectable } from '@angular/core';
import { EventoModel } from '../models/evento.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataShareService } from './data-share.service';
import { PerfilUsuarioModel } from '../models/perfil-usuario.model';
import { PublicacionModel } from '../models/publicacion.model';


@Injectable({
  providedIn: 'root'
})
export class EventService  {

  private urlABM = 'https://plogger-437eb.firebaseio.com';
  usuario: PerfilUsuarioModel={};

  filterFechaDesde = null;
  filterFechaHasta = null;
  filterCiudad = null;

  constructor(private http: HttpClient,
              private dataShare: DataShareService) { 
  
     this.dataShare.currentUser.subscribe( usuario => this.usuario = usuario);
              }
              

//postea el evento 
guardarEvento(evento: EventoModel) {
  return this.http.post(`${this.urlABM}/evento.json`, evento);
}

obtenerEventos(){
  return this.http.get(`${ this.urlABM }/evento.json`)
  .pipe(
    map( resp=>this.crearArregloEventos(resp) )
  );
}

private crearArregloEventos(resp){
  if (resp===null||resp===undefined) {return [];}
  //Armo el vector iterable para las publicaciones
  const eventos: EventoModel[] = [];
  Object.keys(resp).forEach(key =>{
    
      let evento: EventoModel = resp[key];
      evento.id = key;

      // arreglo publicaciones en evento

    const publicaciones: PublicacionModel[] = [];
    var x = resp[key].publicaciones;
    if (x === undefined || x === null) {
      evento.publicaciones = [];
    }
    else {
      Object.keys(resp[key].publicaciones).forEach(keyPublicacion =>{
        
        let publicacion: PublicacionModel = resp[key].publicaciones[keyPublicacion];
        publicacion.pid = keyPublicacion.toString();
        publicaciones.unshift(publicacion);
      });
    }
    evento.publicaciones = publicaciones;

// aca termina

      eventos.unshift(evento);
  });
  return eventos;
}

obtenerEventosReportados(){
  return this.http.get(`${ this.urlABM }/reportes/eventos.json`)
  .pipe(
    map( resp=>this.crearArregloEventosReportados(resp) )
  );
}

private crearArregloEventosReportados(resp){
  if (resp===null||resp===undefined) {return [];}
  //Armo el vector iterable para las publicaciones
  const eventos: EventoModel[] = [];
  Object.keys(resp).forEach(key =>{
    
      let evento: EventoModel = resp[key];
      evento.id = key;

      // arreglo publicaciones en evento

    const publicaciones: PublicacionModel[] = [];
    var x = resp[key].publicaciones;
    if (x === undefined || x === null) {
      evento.publicaciones = [];
    }
    else {
      Object.keys(resp[key].publicaciones).forEach(keyPublicacion =>{
        
        let publicacion: PublicacionModel = resp[key].publicaciones[keyPublicacion];
        publicacion.pid = keyPublicacion.toString();
        publicaciones.unshift(publicacion);
      });
    }
    evento.publicaciones = publicaciones;

// aca termina

      eventos.unshift(evento);
  });
  return eventos;
}

borrarEvento(eventoId: string) {
  return this.http.delete(`${ this.urlABM }/evento/${eventoId}.json`);
}

borrarEventoReportado(eventoId: string) {
  return this.http.delete(`${ this.urlABM }/reportes/eventos/${eventoId}.json`);
}

editarEvento(evento: EventoModel) {
  var data = {
   ...evento
  };
  return this.http.put(`${ this.urlABM }/evento/${evento.id}.json`, data);
}

obtenerMisEventos(){
  return this.http.get(`${ this.urlABM }/evento.json`)
  .pipe(
    map( resp=>this.crearArregloMisEventos(resp) )
  );
}

private crearArregloMisEventos(resp){
const eventos: EventoModel[] = [];
let uid = this.usuario.uid;

if (resp===null||resp===undefined) {return [];}

Object.keys(resp).forEach(key =>{
  if (resp[key].uid===uid) {
    const evento: EventoModel = resp[key];
    evento.id = key;

    // arreglo publicaciones en evento

    const publicaciones: PublicacionModel[] = [];
        var x = resp[key].publicaciones;
        if (x === undefined || x === null) {
          evento.publicaciones = [];
        }
        else {
          Object.keys(resp[key].publicaciones).forEach(keyPublicacion =>{
            
            let publicacion: PublicacionModel = resp[key].publicaciones[keyPublicacion];
            publicacion.pid = keyPublicacion.toString();
            publicaciones.unshift(publicacion);
          });
        }
        evento.publicaciones = publicaciones;

    // aca termina
    eventos.unshift(evento);
  }
});
return eventos; 
}

publicarEnEvento(eid: string, publicacion:PublicacionModel) {

  return this.http.post(`${this.urlABM}/evento/${eid}/publicaciones.json`, publicacion);
}

obtenerInvitados(eventoId) {
  return this.http.get(`${this.urlABM}/evento/${eventoId}/invitados.json`)
}

agregarInvitados(eventoId, invitados) {
      // return this.http.put(`${this.urlABM}/evento/${eventoId}/invitados.json`,invitadosArray);

      return this.http.get(`${this.urlABM}/evento/${eventoId}/invitados.json`)
      .pipe(map((x:any) => {
        let invitadosArray: any[]; 
        if (x!==null) {
          //aca viene cuando ya tiene algun evento en meInteresa
          for (let index = 0; index < x.length; index++) {
            invitados.forEach(invitado => {
              if (x[index]===invitado) {
                return;
              }
            });
            
          }
          invitadosArray = x;
          invitados.forEach(i => {
            invitadosArray.push(i);
            
          });
         
          return this.http.put(`${this.urlABM}/evento/${eventoId}/invitados.json`,invitadosArray).subscribe();
        } else {
          //aca viene cuando no tiene algun evento en meInteresa
          invitadosArray = invitados; 
          return this.http.put(`${this.urlABM}/evento/${eventoId}/invitados.json`,invitadosArray).subscribe();    
        }
      }));
}


agregarAsistire(eventoId) {
  return this.http.get(`${this.urlABM}/evento/${eventoId}/asistire.json`)
  .pipe(map((x:any) => {
    let asistireArray: any[]; 
    if (x!==null) {
      //aca viene cuando ya tiene algun evento en meInteresa
      for (let index = 0; index < x.length; index++) {
        if (x[index]===this.usuario.key) {
          return;
        }
      }
      asistireArray = x;
      asistireArray.push(this.usuario.key);
      return this.http.put(`${this.urlABM}/evento/${eventoId}/asistire.json`,asistireArray).subscribe();
    } else {
      //aca viene cuando no tiene algun evento en meInteresa
      asistireArray = [this.usuario.key]; 
      return this.http.put(`${this.urlABM}/evento/${eventoId}/asistire.json`, asistireArray).subscribe();    
    }
  }));
}

eliminarAsistire(eventoId) {
  return this.http.get(`${this.urlABM}/evento/${eventoId}/asistire.json`)
  .pipe(map((x:any) => {
    if (x!==null) {
      for (let index = 0; index < x.length; index++) {
        if (x[index]===this.usuario.key) {
          return this.http.delete(`${ this.urlABM }/evento/${ eventoId }/asistire/${ index }.json`).subscribe();
        }
      }
    }
  }));
}

likePost(eid: string, publicacion:PublicacionModel){
  // Obtiene los like
  return this.http.get(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`)
  .pipe(map((x:any) => {
    let likeArray: any[]; 
    if (x!==null) {
      //aca viene cuando la publicacion ya tiene likes
      for (let index = 0; index < x.length; index++) {
        if (x[index]===this.usuario.uid) {
          return;
        }
      }
      likeArray = x;
      likeArray.push(this.usuario.uid);
      return this.http.put(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`,likeArray).subscribe();
    } else {
      //aca viene cuando es el primer like de una publicacion
      likeArray = [this.usuario.uid]; 
      return this.http.put(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`,likeArray).subscribe();    
    }
  }));
}

dislikePost(eid:string, publicacion: PublicacionModel){
  // Obtiene los like
  return this.http.get(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like.json`)
  .pipe(map((x:any) => {
    if (x!==null) {
      for (let index = 0; index < x.length; index++) {
        if (x[index]===this.usuario.uid) {
          return this.http.delete(`${this.urlABM}/evento/${eid}/publicaciones/${ publicacion.pid }/like/${ index }.json`).subscribe();
        }
      }
    }
  }));
}

obtenerTipoEventos(){
  return this.http.get('https://plogger-437eb.firebaseio.com/tipoEvento.json')
  .pipe(
    map( resp=>this.crearArregloTipoEventos(resp) )
  );
}

private crearArregloTipoEventos(resp){
  if (resp===null||resp===undefined) {return [];}
  //Armo el vector iterable para las publicaciones
  const eventos: any[] = [];
  Object.keys(resp).forEach(key =>{
    
      let evento: any = resp[key];
     
      evento.buscarTipo = evento.descripcion;



      eventos.unshift(evento);
  });
  return eventos;
}

obtenerDescripcionTipoEventos(id){
  return this.http.get(`https://plogger-437eb.firebaseio.com/tipoEvento/${ id }.json`);
}

obtenerEvento(eventoId) {
  return this.http.get(`${this.urlABM}/evento/${eventoId}.json`);
}

report(event,personaQueReporta){
  // Obtiene los reportes
  return this.http.get(`${ this.urlABM }/reportes/eventos/${ event.id }.json`)
  .pipe(map((x:any) => {
    console.log(event);
    let reportadosArray: any[]; 
    if (x!==null) {
      //aca viene cuando ya reportre a otras
      for (let index = 0; index < x.length; index++) {
        if (x[index]===this.usuario.reportados) {
          return;
        }
      }
      reportadosArray = x;
      reportadosArray.push(event);
      //console.log(reportadosArray);
      return this.http.put(`${ this.urlABM }/reportes/eventos/${ event.id }.json`,event).subscribe(resp =>{
        this.usuario.reportados =reportadosArray;
      
       
      });
    } else {
      //aca viene cuando es el primer reporte
      event.personaReporta = personaQueReporta;
      reportadosArray = [event]; 
      //console.log(reportadosArray);
      return this.http.put(`${ this.urlABM }/reportes/eventos/${ event.id }.json`,event).subscribe(resp =>{
        this.usuario.reportados =reportadosArray;
      });
    }
  }));
} 

obtenerEventosEnProceso(){
  return this.http.get(`${ this.urlABM }/evento.json`)
  .pipe(
    map( resp=>this.crearArregloEventosEnProceso(resp) )
  );
}

private crearArregloEventosEnProceso(resp){
  if (resp===null||resp===undefined) {return [];}
  //Armo el vector iterable para eventos
  const eventos: EventoModel[] = [];
  Object.keys(resp).forEach(key =>{
    
      let evento: EventoModel = resp[key];
      evento.id = key;

      let fechaActual = new Date; 
      let fechaFinEvento = evento.endDate;
      if (fechaFinEvento > fechaActual.toISOString()){
        eventos.unshift(evento);
        return;
      }

  });
  return eventos;
}

obtenerEventosFinalizados(){
  return this.http.get(`${ this.urlABM }/evento.json`)
  .pipe(
    map( resp=>this.crearArregloEventoFinalizados(resp) )
  );
}

private crearArregloEventoFinalizados(resp){
  if (resp===null||resp===undefined) {return [];}
  //Armo el vector iterable para eventos
  const eventos: EventoModel[] = [];
  Object.keys(resp).forEach(key =>{
    
      let evento: EventoModel = resp[key];
      evento.id = key;

      let fechaActual = new Date; 
      let fechaFinEvento = evento.endDate;
      if (fechaFinEvento < fechaActual.toISOString()){
        eventos.unshift(evento);
        return;
      }

  });
  return eventos;
}
    

}
