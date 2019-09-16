import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalEventPage } from './modal-event.page';

import { ReactiveFormsModule } from '@angular/forms';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { AutoCompleteModule } from 'ionic4-auto-complete';


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
    AutoCompleteModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalEventPage],
  providers: [ Geolocation ]
})
export class ModalEventPageModule {}
