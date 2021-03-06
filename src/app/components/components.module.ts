import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PopProfileSettingsComponent } from './pop-profile-settings/pop-profile-settings.component';
import { PublicacionComponent } from "./publicacion/publicacion.component";

//Estos modals ya no hacen falta, los dejo por las dudas
import { PopPublicacionSettingsComponent } from './pop-publicacion-settings/pop-publicacion-settings.component';
import { FormsModule } from '@angular/forms';
import { EventoComponent } from './evento/evento.component';
import { PublicacionOthersComponent } from './publicacion-others/publicacion-others.component';
import { PublicacionEventoComponent } from './publicacion-evento/publicacion-evento.component';
import { PopEventoSettingsComponent } from './pop-evento-settings/pop-evento-settings.component';
import { PopLikesComponent } from './pop-likes/pop-likes.component';
import { PopFollowComponent } from './pop-follow/pop-follow.component';
import { PopPublicacionesReportComponent } from './pop-publicaciones-report/pop-publicaciones-report.component';
import { PublicacionesReportadasComponent } from './publicaciones-reportadas/publicaciones-reportadas.component';
import { EventosReportadosComponent } from './eventos-reportados/eventos-reportados.component';
import { ComboUbicacionComponent } from './ubicacion-usuario/combo-ubicacion.component';
import { PopNotificacionesComponent } from './pop-notificaciones/pop-notificaciones.component';
import {DatePipe} from '@angular/common';

@NgModule({
  entryComponents: [
    PopPublicacionSettingsComponent,
    PopEventoSettingsComponent,
    PopLikesComponent,
    PopFollowComponent,
    PopPublicacionesReportComponent,
    EventoComponent,
    PopNotificacionesComponent
  ],
  declarations: [
    PopProfileSettingsComponent,
    PopPublicacionSettingsComponent,
    PublicacionComponent,
    PublicacionesReportadasComponent,
    EventosReportadosComponent,
    EventoComponent,
    PublicacionOthersComponent,
    PublicacionEventoComponent,
    PopEventoSettingsComponent,
    PopPublicacionesReportComponent,
    PopLikesComponent,
    PopFollowComponent,
    ComboUbicacionComponent,
    PopNotificacionesComponent
  ],
  exports: [
    PopProfileSettingsComponent,
    PopPublicacionesReportComponent,
    PopPublicacionSettingsComponent,
    PublicacionesReportadasComponent,
    EventosReportadosComponent,
    PublicacionComponent,
    EventoComponent,
    PublicacionOthersComponent,
    PublicacionEventoComponent,
    PopEventoSettingsComponent,
    PopLikesComponent,
    PopFollowComponent,
    ComboUbicacionComponent,
    PopNotificacionesComponent
  ],
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ]
})
export class ComponentsModule {}
