export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  preview_url: string | null;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  uri: string;
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
  release_date: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface SearchResponse {
  tracks: {
    items: Track[];
    total: number;
  };
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}


export interface ArtistSearchResponse {
  artists: {
    items: ArtistDetailed[];
    total: number;
  };
}


export interface ArtistDetailed {
  id: string;
  name: string;
  images: Image[];
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
  uri: string;
}


export interface AlbumsResponse {
  items: AlbumDetailed[];
  total: number;
}


export interface AlbumDetailed {
  id: string;
  name: string;
  images: Image[];
  release_date: string;
  total_tracks: number;
  artists: Artist[];
  album_type: string;
  external_urls: {
    spotify: string;
  };
  uri: string;
}


export interface AlbumTracksResponse {
  items: AlbumTrack[];
  total: number;
}


export interface AlbumTrack {
  id: string;
  name: string;
  artists: Artist[];
  duration_ms: number;
  track_number: number;
  preview_url: string | null;
  uri: string;
  external_urls: {
    spotify: string;
  };
}