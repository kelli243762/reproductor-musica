import { Routes } from '@angular/router';
import { PlayerComponent } from './components/player/player.component';
import { ArtistListComponent } from './components/artist-list/artist-list';
import { ArtistAlbumsComponent } from './components/artist-albums/artist-albums';
import { AlbumTracksComponent } from './components/album-tracks/album-tracks';

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
    path: 'artists',
    component: ArtistListComponent
  },
  {
    path: 'artist/:id/albums',
    component: ArtistAlbumsComponent
  },//Navega a albumes
  {
    path: 'album/:id/tracks',
    component: AlbumTracksComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];