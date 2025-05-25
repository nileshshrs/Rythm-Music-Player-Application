import { Song } from "@/utils/types";
import { ReactNode, createContext, useContext, useState } from "react"

type QueueType = "single" | "album";
interface MusicContextType {
    currentSong: Song | null;
    queue: Song[];
    queueType: QueueType
    playSingle: (song: Song) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
}


const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [queue, setQueue] = useState<Song[]>([]);
    const [queueType, setQueueType] = useState<QueueType>("single");
    const playSingle = (song: Song) => {
        setCurrentSong(song);
        setQueue([song]);
        setQueueType("single");
    };

    const playAlbum = (songs: Song[], startIndex: number = 0) => {
        setQueue(songs);
        setCurrentSong(songs[startIndex]);
        setQueueType("album");
    };
    return (
        <MusicContext.Provider
            value={{
                currentSong,
                queue,
                queueType,
                playSingle,
                playAlbum,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};


export const useMusicContext = () => {
    const context = useContext(MusicContext)
    if (!context) throw new Error("useMusicContext must be used within a MusicContextProvider")
}