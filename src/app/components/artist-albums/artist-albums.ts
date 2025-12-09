import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { ArtistDetailed, AlbumDetailed } from '../../models/track.model';

@Component({
  selector: 'app-artist-albums',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-albums.html',
  styleUrls: ['./artist-albums.css']
})
export class ArtistAlbumsComponent implements OnInit {
  private spotifyService = inject(SpotifyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  artist: ArtistDetailed | null = null;
  albums: AlbumDetailed[] = [];
  isLoading = false;
  artistId: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      

      this.artistId = params['id'];


      this.loadArtistData();
      this.loadAlbums();
    });
  }//Carga informacion

  loadArtistData(): void {
    this.spotifyService.getArtist(this.artistId).subscribe({
      next: (artist: any) => {
        this.artist = artist;
      },
      error: (error: any) => {
        console.error('Error cargando artista:', error);
      }
    });
  }

  loadAlbums(): void {
    this.isLoading = true;
    this.spotifyService.getArtistAlbums(this.artistId).subscribe({
      next: (response: any) => {
        this.albums = response.items;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error cargando álbumes:', error);
        this.isLoading = false;
      }
    });
  }

  goToAlbumTracks(albumId: string): void {
    this.router.navigate(['/album', albumId, 'tracks']);
  }

  goBack(): void {
    this.router.navigate(['/artists']);
  }

  getAlbumImage(album: AlbumDetailed): string {
    return album.images && album.images.length > 0 
      ? album.images[0].url 
      : 'assets/default-album.png';
  }

  getArtistImage(): string {
    return this.artist && this.artist.images && this.artist.images.length > 0
      ? this.artist.images[0].url
      : 'assets/default-artist.png';
  }

  getReleaseYear(date: string): string {
    return date.split('-')[0];
  }
}