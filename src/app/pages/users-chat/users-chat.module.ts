import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UsersChatPage } from './users-chat.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AutoCompleteModule } from 'ionic4-auto-complete';

const routes: Routes = [
  {
    path: '',
    component: UsersChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AutoCompleteModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UsersChatPage]
})
export class UsersChatPageModule {}
