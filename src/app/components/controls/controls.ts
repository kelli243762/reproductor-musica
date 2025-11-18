import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './controls.html',
  styleUrls: ['./controls.css']
})
export class ControlsComponent {
  @Input() isPlaying: boolean = false;
  @Output() playPause = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() volumeChange = new EventEmitter<number>();

  volume: number = 70;
  isMuted: boolean = false;
  previousVolume: number = 70;

  onPlayPause(): void {
    this.playPause.emit();
  }

  onNext(): void {
    this.next.emit();
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.volume = parseInt(target.value);
    this.volumeChange.emit(this.volume / 100);
    
    if (this.volume === 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
  }

  toggleMute(): void {
    if (this.isMuted) {
      this.volume = this.previousVolume;
      this.isMuted = false;
    } else {
      this.previousVolume = this.volume;
      this.volume = 0;
      this.isMuted = true;
    }
    this.volumeChange.emit(this.volume / 100);
  }

  get volumeIcon(): string {
    if (this.isMuted || this.volume === 0) return '🔇';
    if (this.volume < 30) return '🔈';
    if (this.volume < 70) return '🔉';
    return '🔊';
  }
}