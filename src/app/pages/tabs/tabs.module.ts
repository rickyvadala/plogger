import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPage } from './tabs.page';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'events',
        loadChildren: '../events/events.module#EventsPageModule'
      },
      {
        path: 'home',
        loadChildren: '../home/home.module#HomePageModule'
      },
      {
        path: 'profile',
        loadChildren: '../profile/profile.module#ProfilePageModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
