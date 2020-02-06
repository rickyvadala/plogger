import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { ComponentsModule } from 'src/app/components/components.module';

import { AutoCompleteModule } from 'ionic4-auto-complete';
import { EventoComponent } from 'src/app/components/evento/evento.component';
import { PopNotificacionesComponent } from '../../components/pop-notificaciones/pop-notificaciones.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  entryComponents: [
    EventoComponent,
    PopNotificacionesComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    AutoCompleteModule,
    
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
