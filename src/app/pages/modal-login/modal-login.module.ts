import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalLoginPage } from './modal-login.page';

const routes: Routes = [
  {
    path: '',
    component: ModalLoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    ],
  declarations: [ModalLoginPage]
})
export class ModalLoginPageModule {}
