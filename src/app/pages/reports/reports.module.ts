import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsPage } from './reports.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  {
    path: '',
    component: ReportsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    NgxChartsModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
