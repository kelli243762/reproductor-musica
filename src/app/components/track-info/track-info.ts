import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-track-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-info.html',
  styleUrls: ['./track-info.css']
})
export class TrackInfoComponent {
  @Input() track: Track | null = null;

  get albumImage(): string {
    if (this.track && this.track.album.images.length > 0) {
      return this.track.album.images[0].url;
    }
    return 'assets/default-album.png';
  }

  get artistNames(): string {
    if (this.track) {
      return this.track.artists.map(artist => artist.name).join(', ');
    }
    return '';
  }
}