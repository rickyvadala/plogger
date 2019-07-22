import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalRegisterPage } from './modal-register.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ModalRegisterPage]
})
export class ModalRegisterPageModule {}
