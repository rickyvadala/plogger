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

@NgModule({
  entryComponents: [
    ModalProfilePage, 
    PopPublicacionSettingsComponent
  ],
  declarations: [
    PopProfileSettingsComponent,
    PopPublicacionSettingsComponent,
    PublicacionComponent
  ],
  exports: [
    PopProfileSettingsComponent,
    PopPublicacionSettingsComponent,
    PublicacionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ModalProfilePageModule
  ]
})
export class ComponentsModule {}
