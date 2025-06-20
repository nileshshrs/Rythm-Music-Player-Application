// types/album.ts

export type Album = {
    _id?: string;
    title: string;
    artist: string;
    artistImage?: string;
    coverImage?: string;
    releaseDate?: string; // ISO format (use Date if parsing later)
    genre?: string;
    themeColor: string;
    totalSongs?: number; // added for fast lookup/count
};


// types/song.ts

export type Song = {
    _id?: string;
    title: string;
    artist: string;
    artistImage?: string;
    audioUrl: string;
    duration: number; // seconds
    songImage?: string;
    album?: string | null; // album ID
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

// --- User Type ---
export type User = {
    _id: string;
    email: string;
    username: string;
    role?: string;
    image?: string;
    bio?: string;
    // Add more user fields here if you need
};

// --- Login Types ---
export type LoginRequest = {
    usernameOrEmail: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    user: User;
};

// --- AuthContext Shape ---
export type AuthContextType = {
    user: User | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: { email: string; username: string; password: string }) => Promise<void>; // ADD THIS
    logout: () => void;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
};

export interface Participant {
    _id: string;
    username: string;
    image?: string[] | undefined;
}

export interface conversation {
    _id: string;
    createdAt: string;
    updatedAt: string;
    lastMessage: string;
    participants: Participant[];

}

export type MinimalPlaylist = {
  _id: string;
  name: string;
  coverImage: string;
  totalSongs: number;
  username: string;
};
