import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent {
  @Input() tracks: Track[] = [];
  @Input() searchResults: Track[] = [];
  @Input() currentTrack: Track | null = null;
  @Output() trackSelect = new EventEmitter<Track>();

  activeTab: 'playlist' | 'search' = 'playlist';

  selectTrack(track: Track): void {
    this.trackSelect.emit(track);
  }

  isCurrentTrack(track: Track): boolean {
    return this.currentTrack?.id === track.id;
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getArtistNames(track: Track): string {
    return track.artists.map(artist => artist.name).join(', ');
  }

  switchTab(tab: 'playlist' | 'search'): void {
    this.activeTab = tab;
  }
}