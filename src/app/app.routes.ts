import { Routes } from '@angular/router';
import { PlayerComponent } from './components/player/player.component';

export const routes: Routes = [
  {
    path: '',
    component: PlayerComponent
  },
  {
    path: 'callback',
    component: PlayerComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];