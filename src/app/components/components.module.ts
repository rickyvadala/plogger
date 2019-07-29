import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PopProfileSettingsComponent } from './pop-profile-settings/pop-profile-settings.component';

@NgModule({
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
  ]
})
export class ComponentsModule {}
