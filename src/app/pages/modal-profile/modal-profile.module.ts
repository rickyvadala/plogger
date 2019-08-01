import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalProfilePage } from './modal-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ModalProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    ],
  declarations: [ModalProfilePage]
})
export class ModalProfilePageModule {}
