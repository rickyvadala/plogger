import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';




import { IonicModule } from '@ionic/angular';

import { ChatPage } from './chat.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AngularFirestoreModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
