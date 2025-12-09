import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { ArtistDetailed } from '../../models/track.model';
import { SearchBarComponent } from '../search-bar/search-bar';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './artist-list.html',
  styleUrls: ['./artist-list.css']
})
export class ArtistListComponent implements OnInit {
  private spotifyService = inject(SpotifyService);
  private router = inject(Router);
  
  artists: ArtistDetailed[] = [];
  isLoading = false;

  ngOnInit(): void {}

  onSearch(query: string): void {
    if (query.trim()) {
      this.isLoading = true;
      this.spotifyService.searchArtists(query).subscribe({
        next: (response: any) => {
          this.artists = response.artists.items;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error buscando artistas:', error);
          this.isLoading = false;
        }
      });
    }
  }

  goToArtistAlbums(artistId: string): void {


    this.router.navigate(['/artist', artistId, 'albums']);

    
  } //Navega

  getArtistImage(artist: ArtistDetailed): string {
    return artist.images && artist.images.length > 0 
      ? artist.images[0].url 
      : 'assets/default-artist.png';
  }
}