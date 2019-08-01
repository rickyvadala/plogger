import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PopProfileSettingsComponent } from './pop-profile-settings/pop-profile-settings.component';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalProfilePageModule } from '../pages/modal-profile/modal-profile.module';

@NgModule({
  entryComponents: [
    ModalProfilePage
  ],
  declarations: [
    PopProfileSettingsComponent
  ],
  exports: [
    PopProfileSettingsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ModalProfilePageModule
  ]
})
export class ComponentsModule {}
