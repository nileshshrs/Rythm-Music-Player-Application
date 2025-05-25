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
    songImage: string;
    album?: string; // album ID

};

export interface AlbumResponse {
    album?: Album;
    songs?: Song[];
};
