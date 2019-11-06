import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalRegisterPage } from './modal-register.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TerminosCondicionesPage } from '../terminos-condiciones/terminos-condiciones.page';


const routes: Routes = [
  {
    path: '',
    component: ModalRegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ModalRegisterPage,TerminosCondicionesPage],
  entryComponents: [TerminosCondicionesPage]
})
export class ModalRegisterPageModule {}
