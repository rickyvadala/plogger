import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { ModalLoginPageModule } from '../modal-login/modal-login.module';
import { ModalLoginPage } from '../modal-login/modal-login.page';
import { ModalRegisterPageModule } from '../modal-register/modal-register.module';
import { ModalRegisterPage } from '../modal-register/modal-register.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  entryComponents: [
    ModalLoginPage,
    ModalRegisterPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModalLoginPageModule,
    ModalRegisterPageModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
  
}
