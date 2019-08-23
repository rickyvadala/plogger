import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PopProfileSettingsComponent } from './pop-profile-settings/pop-profile-settings.component';
import { PublicacionComponent } from "./publicacion/publicacion.component";

//Estos modals ya no hacen falta, los dejo por las dudas
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalProfilePageModule } from '../pages/modal-profile/modal-profile.module';
import { PopPublicacionSettingsComponent } from './pop-publicacion-settings/pop-publicacion-settings.component';
import { PublicarComponent } from './publicar/publicar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  entryComponents: [
    ModalProfilePage, 
    PopPublicacionSettingsComponent
  ],
  declarations: [
    PopProfileSettingsComponent,
    PopPublicacionSettingsComponent,
    PublicacionComponent,
    PublicarComponent
  ],
  exports: [
    PopProfileSettingsComponent,
    PopPublicacionSettingsComponent,
    PublicacionComponent,
    PublicarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ModalProfilePageModule,
    FormsModule
  ]
})
export class ComponentsModule {}
