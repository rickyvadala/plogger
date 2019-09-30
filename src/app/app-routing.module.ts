import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard]},
  { path: 'events', loadChildren: './pages/events/events.module#EventsPageModule', canActivate: [AuthGuard]},
  { path: 'cuenta', loadChildren: './pages/cuenta/cuenta.module#CuentaPageModule',canActivate: [AuthGuard] },
  { path: 'event', loadChildren: './pages/modal-event/modal-event.module#ModalEventPageModule',canActivate: [AuthGuard] },
  { path: 'profile/:id', loadChildren: './pages/profile-other/profile-other.module#ProfileOtherPageModule', canActivate: [AuthGuard] },
  { path: 'event/:id', loadChildren: './pages/event/event.module#EventPageModule', canActivate: [AuthGuard] },
  { path: 'event-type/:id', loadChildren: './pages/event-type/event-type.module#EventTypePageModule', canActivate: [AuthGuard] },
  { path: 'compartir-evento', loadChildren: './pages/compartir-evento/compartir-evento.module#CompartirEventoPageModule', canActivate: [AuthGuard] },
  { path: 'message', loadChildren: './pages/message/message.module#MessagePageModule', canActivate: [AuthGuard] },
  { path: 'users-chat', loadChildren: './pages/users-chat/users-chat.module#UsersChatPageModule', canActivate: [AuthGuard] },
  { path: 'chat', loadChildren: './pages/chat/chat.module#ChatPageModule', canActivate: [AuthGuard] },
  { path: 'asistiran', loadChildren: './pages/asistiran/asistiran.module#AsistiranPageModule', canActivate: [AuthGuard] },
  { path: 'invitar-amigos/:id', loadChildren: './pages/invitar-amigos/invitar-amigos.module#InvitarAmigosPageModule', canActivate: [AuthGuard] }


  // { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule'},
  // { path: 'home', loadChildren: './pages/home/home.module#HomePageModule'},
  // { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule'},
  // { path: 'events', loadChildren: './pages/events/events.module#EventsPageModule'},
  // { path: 'cuenta', loadChildren: './pages/cuenta/cuenta.module#CuentaPageModule' },
  // { path: 'event', loadChildren: './pages/modal-event/modal-event.module#ModalEventPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
