import { Song } from "@/utils/types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

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
  setCurrentIndex: (index: number) => void;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
  loop: boolean;
  toggleLoop: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueType, setQueueType] = useState<QueueType>("single");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);

  const getInitialLoop = () => JSON.parse(localStorage.getItem("loop") || "false");
  const [loop, setLoop] = useState<boolean>(getInitialLoop());

  const getInitialShuffle = () => JSON.parse(localStorage.getItem("shuffle") || "false");
  const [shuffle, setShuffle] = useState<boolean>(getInitialShuffle());

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setAudioRef = (ref: HTMLAudioElement | null) => {
    audioRef.current = ref;
  };

  const toggleLoop = () => {
    setLoop((prev) => {
      const next = !prev;
      localStorage.setItem("loop", JSON.stringify(next));
      return next;
    });
  };

  const toggleShuffle = () => {
    setShuffle((prev) => {
      const next = !prev;
      localStorage.setItem("shuffle", JSON.stringify(next));
      if (next) setPlayedIndices([]);
      return next;
    });
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
    setPlayedIndices([]);
  };

  const playAlbum = (songs: Song[], startIndex: number = 0) => {
    setQueue(songs);
    setQueueType("album");
    setCurrentSong(songs[startIndex]);
    setCurrentIndex(startIndex);
    setPlayedIndices([startIndex]);
  };
  const playNext = () => {
    if (loop && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Loop play failed:", err));
      return;
    }

    if (shuffle && queue.length > 1) {
      const allIndices = queue.map((_, i) => i);

      // Ensure currentIndex is marked as played only once
      setPlayedIndices((prev) => {
        if (!prev.includes(currentIndex)) return [...prev, currentIndex];
        return prev;
      });

      const remaining = allIndices.filter((i) => !playedIndices.includes(i) && i !== currentIndex);

      if (remaining.length === 0) {
        // Nothing left to play
        setCurrentSong(null);
        setCurrentIndex(-1);
        setIsPlaying(false);
        return;
      }

      const nextIndex = remaining[Math.floor(Math.random() * remaining.length)];
      setPlayedIndices((prev) => [...prev, nextIndex]);
      setCurrentSong(queue[nextIndex]);
      setCurrentIndex(nextIndex);
      return;
    }

    // Normal (non-shuffle) playback
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
    if (loop && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Loop play failed:", err));
      return;
    }

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSong(queue[prevIndex]);
      setCurrentIndex(prevIndex);
    } else {
      setCurrentSong(queue[0] || null);
      setCurrentIndex(queue.length > 0 ? 0 : -1);
    }
  };

  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !user?._id) return;

    // Only emit when song or play state changes
    if (currentSong && isPlaying) {
      socket.emit("user-activity", {
        userId: user._id,
        songTitle: currentSong.title,
        songId: currentSong._id,
      });
    } else {
      socket.emit("user-activity", {
        userId: user._id,
        songTitle: null,
        songId: null,
      });
    }
  }, [currentSong, isPlaying, socket, user?._id]);


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
        setIsPlaying,
        currentIndex,
        setCurrentIndex,
        setAudioRef,
        loop,
        toggleLoop,
        shuffle,
        toggleShuffle,
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
