// types/album.ts

export type Album = {
    _id: string;
    title: string;
    artist: string;
    artistImage?: string;
    coverImage?: string;
    releaseDate?: string; // ISO format (use Date if parsing later)
    genre?: string;
    themeColor: string;
};


// types/song.ts

export type Song = {
    _id: string;
    title: string;
    artist: string;
    artistImage?: string;
    audioUrl: string;
    duration: number; // seconds
    songImage?: string;
    album?: string; // album ID
    albumTitle?: string; // album title for display
    themeColor?: string; // color for UI theming
};

export interface AlbumResponse {
    album?: Album;
    songs?: Song[];
};


export type Playlist = {
  _id: string;
  name: string;
  coverImage?: string;
  description?: string;
  songs: Song[];
  themeColor: string;
  createdAt: string; // ISO string, parse as Date if needed
  updatedAt: string; // ISO string
  username: string;
};