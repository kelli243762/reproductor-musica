import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Track, SearchResponse, ArtistSearchResponse, ArtistDetailed, AlbumsResponse, AlbumTracksResponse } from '../models/track.model';
import { SpotifyConfig, getAuthUrl } from '../config/spotify.config';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private apiUrl = 'https://api.spotify.com/v1';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTokenFromStorage();
  }

  async login(): Promise<void> {
    const authUrl = await getAuthUrl();
    window.location.href = authUrl;
  }

  async handleCallback(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const codeVerifier = localStorage.getItem('code_verifier');
      
      if (!codeVerifier) {
        console.error('No code verifier found');
        return;
      }

      const body = new URLSearchParams({
        client_id: SpotifyConfig.clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SpotifyConfig.redirectUri,
        code_verifier: codeVerifier,
      });

      try {
        const response = await fetch(SpotifyConfig.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        });

        const data = await response.json();
        
        if (data.access_token) {
          this.setToken(data.access_token);
          localStorage.removeItem('code_verifier');
          window.history.replaceState({}, document.title, '/');
        } else {
          console.error('Error en respuesta de Spotify:', data);
        }
      } catch (error) {
        console.error('Error exchanging code for token:', error);
      }
    }
  }

  setToken(token: string): void {
    localStorage.setItem('spotify_token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem('spotify_token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  logout(): void {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('code_verifier');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  private getHeaders(): HttpHeaders {

    const token = this.getToken();//obtiene un token 

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, //token de acceso
      'Content-Type': 'application/json'
    });
  }

  searchTracks(query: string): Observable<SearchResponse> {
    const url = `${this.apiUrl}/search?q=${encodeURIComponent(query)}&type=track&limit=20`;

    return this.http.get<SearchResponse>(url, { headers: this.getHeaders() });//hace la peticion/envia/le regresa en json
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { headers: this.getHeaders() });
  }

  getUserPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/playlists`, { headers: this.getHeaders() });
  }

  getPlaylistTracks(playlistId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists/${playlistId}/tracks`, { 
      headers: this.getHeaders() 
    });
  }

  getRecommendations(seedTracks: string[]): Observable<any> {
    const seeds = seedTracks.slice(0, 5).join(',');
    return this.http.get(`${this.apiUrl}/recommendations?seed_tracks=${seeds}`, {
      headers: this.getHeaders()
    });
  }

  
  searchArtists(query: string): Observable<ArtistSearchResponse> {
    const url = `${this.apiUrl}/search?q=${encodeURIComponent(query)}&type=artist&limit=20`;
    return this.http.get<ArtistSearchResponse>(url, { headers: this.getHeaders() });
  }

  
  getArtist(artistId: string): Observable<ArtistDetailed> {
    const url = `${this.apiUrl}/artists/${artistId}`;
    return this.http.get<ArtistDetailed>(url, { headers: this.getHeaders() });
  }

  
  getArtistAlbums(artistId: string): Observable<AlbumsResponse> {
    const url = `${this.apiUrl}/artists/${artistId}/albums?include_groups=album,single&limit=50`;
    return this.http.get<AlbumsResponse>(url, { headers: this.getHeaders() });
  }

  
  getAlbumTracks(albumId: string): Observable<AlbumTracksResponse> {
    const url = `${this.apiUrl}/albums/${albumId}/tracks`;
    return this.http.get<AlbumTracksResponse>(url, { headers: this.getHeaders() });
  }

  
  getAlbum(albumId: string): Observable<any> {
    const url = `${this.apiUrl}/albums/${albumId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}