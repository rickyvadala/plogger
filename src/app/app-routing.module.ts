import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
  // { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule'},
  // { path: 'home', loadChildren: './pages/home/home.module#HomePageModule'},
  // { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule'},
  // { path: 'events', loadChildren: './pages/events/events.module#EventsPageModule'},


  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard]},
  { path: 'events', loadChildren: './pages/events/events.module#EventsPageModule', canActivate: [AuthGuard]},  { path: 'cuenta', loadChildren: './pages/cuenta/cuenta.module#CuentaPageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
