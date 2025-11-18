import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track, PlayerState } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: HTMLAudioElement;
  private playerStateSubject = new BehaviorSubject<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7
  });

  public playerState$ = this.playerStateSubject.asObservable();
  private playlist: Track[] = [];
  private currentIndex: number = -1;

  constructor() {
    this.audio = new Audio();
    this.audio.volume = 0.7;
    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.updatePlayerState({
        currentTime: this.audio.currentTime,
        duration: this.audio.duration || 0
      });
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updatePlayerState({
        duration: this.audio.duration
      });
    });
  }

  private updatePlayerState(changes: Partial<PlayerState>): void {
    const currentState = this.playerStateSubject.value;
    this.playerStateSubject.next({ ...currentState, ...changes });
  }

  // Cargar y reproducir una canción
  playTrack(track: Track): void {
    if (!track.preview_url) {
      console.warn('Esta canción no tiene preview disponible');
      return;
    }

    this.audio.src = track.preview_url;
    this.audio.load();
    this.audio.play().then(() => {
      this.updatePlayerState({
        currentTrack: track,
        isPlaying: true
      });
    }).catch(error => {
      console.error('Error al reproducir:', error);
    });
  }

  // Play/Pause
  togglePlayPause(): void {
    const state = this.playerStateSubject.value;
    
    if (state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    if (this.audio.src) {
      this.audio.play().then(() => {
        this.updatePlayerState({ isPlaying: true });
      });
    }
  }

  pause(): void {
    this.audio.pause();
    this.updatePlayerState({ isPlaying: false });
  }

  // Siguiente canción
  next(): void {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.playTrack(this.playlist[this.currentIndex]);
    }
  }

  // Canción anterior
  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playTrack(this.playlist[this.currentIndex]);
    }
  }

  // Control de volumen
  setVolume(volume: number): void {
    this.audio.volume = volume;
    this.updatePlayerState({ volume });
  }

  // Seek (mover la posición de reproducción)
  seek(time: number): void {
    this.audio.currentTime = time;
    this.updatePlayerState({ currentTime: time });
  }

  // Cargar playlist
  loadPlaylist(tracks: Track[], startIndex: number = 0): void {
    this.playlist = tracks;
    this.currentIndex = startIndex;
    if (tracks.length > 0) {
      this.playTrack(tracks[startIndex]);
    }
  }

  // Obtener playlist actual
  getPlaylist(): Track[] {
    return this.playlist;
  }

  // Obtener índice actual
  getCurrentIndex(): number {
    return this.currentIndex;
  }
}