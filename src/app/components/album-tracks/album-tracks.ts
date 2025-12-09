import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { PlayerService } from '../../services/player.service';
import { AlbumTrack, Track } from '../../models/track.model';

@Component({
  selector: 'app-album-tracks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-tracks.html',
  styleUrls: ['./album-tracks.css']
})
export class AlbumTracksComponent implements OnInit {
  private spotifyService = inject(SpotifyService);
  private playerService = inject(PlayerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  album: any = null;
  tracks: AlbumTrack[] = [];
  isLoading = false;
  albumId: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => { //Carga
      this.albumId = params['id'];
      this.loadAlbumInfo();
      this.loadTracks();
    });
  }

  loadAlbumInfo(): void {
    this.spotifyService.getAlbum(this.albumId).subscribe({
      next: (album: any) => {
        this.album = album;
      },
      error: (error: any) => {
        console.error('Error cargando álbum:', error);
      }
    });
  }

  loadTracks(): void {
    this.isLoading = true;
    this.spotifyService.getAlbumTracks(this.albumId).subscribe({
      next: (response: any) => {
        this.tracks = response.items;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error cargando canciones:', error);
        this.isLoading = false;
      }
    });
  }

  playTrack(track: AlbumTrack): void {
    
    const fullTrack: Track = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: this.album ? {
        id: this.album.id,
        name: this.album.name,
        images: this.album.images,
        release_date: this.album.release_date
      } : {
        id: '',
        name: '',
        images: [],
        release_date: ''
      },
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      uri: track.uri,
      external_urls: track.external_urls
    };

    
    const allTracks: Track[] = this.tracks.map(t => ({
      id: t.id,
      name: t.name,
      artists: t.artists,
      album: this.album ? {
        id: this.album.id,
        name: this.album.name,
        images: this.album.images,
        release_date: this.album.release_date
      } : {
        id: '',
        name: '',
        images: [],
        release_date: ''
      },
      duration_ms: t.duration_ms,
      preview_url: t.preview_url,
      uri: t.uri,
      external_urls: t.external_urls
    }));

    const trackIndex = this.tracks.findIndex(t => t.id === track.id);
    this.playerService.loadPlaylist(allTracks, trackIndex);
  }

  goBack(): void {
    if (this.album && this.album.artists && this.album.artists.length > 0) {
      this.router.navigate(['/artist', this.album.artists[0].id, 'albums']);
    } else {
      this.router.navigate(['/artists']);
    }
  }

  getAlbumCover(): string {
    return this.album && this.album.images && this.album.images.length > 0
      ? this.album.images[0].url
      : 'assets/default-album.png';
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getArtistsNames(artists: any[]): string {
    return artists.map(a => a.name).join(', ');
  }
}