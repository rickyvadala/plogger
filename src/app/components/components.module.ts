import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PopProfileSettingsComponent } from './pop-profile-settings/pop-profile-settings.component';
import { PublicacionComponent } from "./publicacion/publicacion.component";

//Estos modals ya no hacen falta, los dejo por las dudas
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalProfilePageModule } from '../pages/modal-profile/modal-profile.module';

@NgModule({
  entryComponents: [
    ModalProfilePage
  ],
  declarations: [
    PopProfileSettingsComponent,
    PublicacionComponent
  ],
  exports: [
    PopProfileSettingsComponent,
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
