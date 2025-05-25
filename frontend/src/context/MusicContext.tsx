import { Song } from "@/utils/types";
import {
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type QueueType = "single" | "album";

interface MusicContextType {
  currentSong: Song | null;
  queue: Song[];
  queueType: QueueType;
  playSingle: (song: Song) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlayPause: () => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentIndex: number;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueType, setQueueType] = useState<QueueType>("single");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setAudioRef = (ref: HTMLAudioElement | null) => {
    audioRef.current = ref;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Play failed:", err);
        });
    }
  };

  const playSingle = (song: Song) => {
    setQueue([song]);
    setCurrentSong(song);
    setQueueType("single");
    setCurrentIndex(0);
  };

  const playAlbum = (songs: Song[], startIndex: number = 0) => {
    setQueue(songs);
    setQueueType("album");
    setCurrentSong(songs[startIndex]);
    setCurrentIndex(startIndex);
  };

  const playNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      setCurrentSong(queue[nextIndex]);
      setCurrentIndex(nextIndex);
    } else {
      setCurrentSong(null);
      setCurrentIndex(-1);
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSong(queue[prevIndex]);
      setCurrentIndex(prevIndex);
    } else {
      setCurrentSong(queue[0] || null);
      setCurrentIndex(queue.length > 0 ? 0 : -1);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        queue,
        queueType,
        playSingle,
        playAlbum,
        playNext,
        playPrevious,
        togglePlayPause,
        isPlaying,
        setIsPlaying, // exposed here
        currentIndex,
        setAudioRef,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusicContext must be used within a MusicContextProvider");
  }
  return context;
};
