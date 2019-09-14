import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalEventPage } from './modal-event.page';

import { ReactiveFormsModule } from '@angular/forms';
import {Geolocation} from '@ionic-native/geolocation/ngx';


const routes: Routes = [
  {
    path: '',
    component: ModalEventPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalEventPage],
  providers: [ Geolocation ]
})
export class ModalEventPageModule {}
