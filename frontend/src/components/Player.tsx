import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ListMusic,
  Repeat,
  Shuffle,
  Volume1,
} from "lucide-react";
import { useMusicContext } from "@/context/MusicContext";
import { useEffect, useRef, useState } from "react";

// Format seconds to mm:ss
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
};

const Player = () => {
  const { currentSong } = useMusicContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current
        .play()
        .catch((err) => console.warn("Autoplay blocked or failed:", err));
    }
  }, [currentSong]);

  return (
    <>
      <footer className="h-auto sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4 pt-3 pb-0 sm:pb-3 text-white">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-0 max-w-[1800px] mx-auto w-full justify-center lg:justify-between">
          
          {/* Song Info (Only on lg and above) */}
          <div className="hidden lg:flex items-center gap-4 min-w-[180px] w-[30%]">
            <img
              src={currentSong?.songImage || "https://via.placeholder.com/56"}
              alt={currentSong?.title || "Song"}
              className="w-14 h-14 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate hover:underline cursor-pointer text-white">
                {currentSong?.title || "Song Title"}
              </p>
              <p className="text-xs text-zinc-400 truncate hover:underline cursor-pointer">
                {currentSong?.artist || "Artist Name"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1 text-white w-full max-w-full px-0 sm:px-2">
            <div className="w-full flex items-center justify-center gap-4 sm:gap-6">
              <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20 5v14l-8.5-7zM4 5h3v14H4z" />
                </svg>
              </Button>

              <Button className="bg-white hover:bg-white/80 text-black rounded-full h-10 w-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Button>

              <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4 5v14l8.5-7zM17 5h3v14h-3z" />
                </svg>
              </Button>

              <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Now Playing (inline for small/medium screens) */}
            <div className="lg:hidden text-xs text-zinc-400 truncate max-w-full text-center px-2">
              {currentSong?.title ? (
                <>
                  <span className="text-white font-medium">{currentSong.title}</span>
                  {currentSong?.artist && (
                    <span className="ml-1 text-zinc-400">by {currentSong.artist}</span>
                  )}
                </>
              ) : (
                <span>No song playing</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-white/70 min-w-[35px] text-right">{formatTime(currentTime)}</span>
              <div className="relative w-full h-1 group">
                <div className="w-full h-1 bg-zinc-600 rounded-full" />
                <div
                  className="absolute top-0 left-0 h-1 bg-green-500 rounded-full"
                  style={{
                    width: `${(currentTime / (duration || 1)) * 100}%`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  step={1}
                  onChange={(e) => {
                    const newTime = Number(e.target.value);
                    if (audioRef.current) {
                      audioRef.current.currentTime = newTime;
                      setCurrentTime(newTime);
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer z-10"
                />
              </div>
              <span className="text-xs text-white/70 min-w-[35px]">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume / Extra Controls (Only on lg and above) */}
          <div className="hidden lg:flex items-center gap-4 min-w-[180px] w-[30%] justify-end text-white">
            <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
              <ListMusic className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 max-w-[140px] w-full">
              <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
                <Volume1 className="h-4 w-4" />
              </Button>

              <Slider
                value={[100]}
                max={100}
                step={1}
                className="w-full hover:cursor-grab active:cursor-grabbing"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Audio Element */}
      {currentSong && (
        <audio
          ref={audioRef}
          hidden
          controls
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
        >
          <source src={currentSong.audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </>
  );
};

export default Player;
