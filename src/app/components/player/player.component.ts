import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { PlayerService } from '../../services/player.service';
import { Track, PlayerState } from '../../models/track.model';

import { SearchBarComponent } from '../search-bar/search-bar';
import { TrackInfoComponent } from '../track-info/track-info';
import { ControlsComponent } from '../controls/controls';
import { ProgressBarComponent } from '../progress-bar/progress-bar';
import { PlaylistComponent } from '../playlist/playlist';



@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    TrackInfoComponent,
    ControlsComponent,
    ProgressBarComponent,
    PlaylistComponent
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})


export class PlayerComponent implements OnInit {

  isAuthenticated = false;

  playerState: PlayerState | null = null;

  searchResults: Track[] = [];//Guarda la busqueda
  

  playlist: Track[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    
    if (window.location.search.includes('code')) {
      await this.spotifyService.handleCallback();
    }


    
    this.spotifyService.token$.subscribe(token => {//llama al servicio de spotify
      
      
      
      
      this.isAuthenticated = !!token;
      if (token) {
        this.loadInitialData();
      }
    });

    
    this.playerService.playerState$.subscribe(state => {
      this.playerState = state;
    });
  }

  async login(): Promise<void> {
    await this.spotifyService.login();
  }

  logout(): void {
    this.spotifyService.logout();
    this.isAuthenticated = false;
  }

  onSearch(query: string): void {
    if (query.trim()) {

      this.spotifyService.searchTracks(query).subscribe({
        next: (response) => {
          this.searchResults = response.tracks.items;
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
        }
      });
    }
  }

  onTrackSelect(track: Track): void {
    // Agregar a playlist si no existe
    if (!this.playlist.find(t => t.id === track.id)) {
      this.playlist = [...this.playlist, track];
    }
    
    
    const index = this.playlist.findIndex(t => t.id === track.id);
    this.playerService.loadPlaylist(this.playlist, index);
  }

  onPlayPause(): void {
    this.playerService.togglePlayPause();
  }

  onNext(): void {
    this.playerService.next();
  }

  onPrevious(): void {
    this.playerService.previous();
  }

  onSeek(time: number): void {
    this.playerService.seek(time);
  }

  onVolumeChange(volume: number): void {
    this.playerService.setVolume(volume);
  }

  goToArtistSearch(): void {
    this.router.navigate(['/artists']);
  }

  private loadInitialData(): void {
    
    this.spotifyService.getUserPlaylists().subscribe({
      next: (playlists) => {
        console.log('Playlists cargadas:', playlists);
      },
      error: (error) => {
        console.error('Error cargando playlists:', error);
      }
    });
  }
}