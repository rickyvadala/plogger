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

@NgModule({
  entryComponents: [
    PopPublicacionSettingsComponent
  ],
  declarations: [
    PopProfileSettingsComponent,
    PopPublicacionSettingsComponent,
    PublicacionComponent,
    EventoComponent
  ],
  exports: [
    PopProfileSettingsComponent,
    PopPublicacionSettingsComponent,
    PublicacionComponent,
    EventoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ]
})
export class ComponentsModule {}
