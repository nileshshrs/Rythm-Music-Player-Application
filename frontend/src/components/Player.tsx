import { Button } from "@/components/ui/button";
import {
  ListMusic,
  Repeat,
  Shuffle,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Vinyl from "./Vinyl";
import { useMusicContext } from "@/context/MusicContext";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
};

const Player = () => {
  const {
    currentSong,
    playNext,
    playPrevious,
    togglePlayPause,
    isPlaying,
    setIsPlaying,
    setAudioRef,
    loop,
    toggleLoop,
    shuffle,
    toggleShuffle,
  } = useMusicContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const getInitialVolume = (): number => {
    const stored = localStorage.getItem("volume");
    return stored ? parseInt(stored) : 60;
  };

  const [volume, setVolume] = useState(getInitialVolume());
  const [isMuted, setIsMuted] = useState(volume === 0);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    localStorage.setItem("volume", volume.toString());
  }, [volume, isMuted]);

  const placeholderImage =
    "/Note.jpg";

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [setAudioRef]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      setCurrentTime(0);
      setDuration(0);

      audio.load();
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setDuration(audio.duration || 0);
        })
        .catch((err) => {
          console.warn("Autoplay blocked or failed:", err);
          setIsPlaying(false);
        });
    }
  }, [currentSong]);

  return (
    <>
      <footer className="h-auto sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4 pt-3 pb-0 sm:pb-3 text-white">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-0 max-w-[1800px] mx-auto w-full justify-center lg:justify-between">
          {/* Song Info */}
          <div className="hidden lg:flex items-center gap-4 min-w-[180px] w-[30%]">
            <Vinyl
              coverImage={currentSong?.songImage || placeholderImage}
              isPlaying={isPlaying}
            />
            <div className={`flex-1 min-w-0 ${currentSong ? "ml-5" : "ml-5"}`}>
              <p className="text-sm font-semibold truncate text-white">
                {currentSong?.title || "No song playing"}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {currentSong?.artist || "Unknown artist"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1 text-white w-full max-w-full px-0 sm:px-2">
            <div className="w-full flex items-center justify-center gap-4 sm:gap-6">
              <Button
                size="icon"
                onClick={toggleShuffle}
                className={`bg-transparent ${shuffle ? "text-green-500" : "text-zinc-400"} hover:text-white`}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button size="icon" onClick={playPrevious} className="text-zinc-400 hover:text-white bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20 5v14l-8.5-7zM4 5h3v14H4z" />
                </svg>
              </Button>

              <Button
                onClick={togglePlayPause}
                className="bg-white hover:bg-white/80 text-black rounded-full h-10 w-10 flex items-center justify-center"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </Button>

              <Button size="icon" onClick={playNext} className="text-zinc-400 hover:text-white bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4 5v14l8.5-7zM17 5h3v14h-3z" />
                </svg>
              </Button>

              <Button
                size="icon"
                onClick={toggleLoop}
                className={`bg-transparent ${loop ? "text-green-500" : "text-zinc-400"} hover:text-white`}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
   
              <div className="block lg:hidden text-white text-sm font-medium truncate text-center w-full px-4">
                {currentSong?.title || "No song playing"} <span className="text-zinc-400">  —  </span> {currentSong?.artist ||"Unknown artist"}
              </div>
     

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-white/70 min-w-[35px] text-right">
                {formatTime(currentTime)}
              </span>
              <div className="relative w-full h-1 group">
                <div className="w-full h-1 bg-zinc-600 rounded-full" />
                <div
                  className="absolute top-0 left-0 h-1 bg-green-500 rounded-full"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)` }}
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
              <span className="text-xs text-white/70 min-w-[35px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="hidden lg:flex items-center gap-4 min-w-[180px] w-[30%] justify-end text-white">
            <Button size="icon" className="text-zinc-400 hover:text-white bg-transparent">
              <ListMusic className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 max-w-[160px] w-full">
              <Button
                size="icon"
                className="text-zinc-400 hover:text-white bg-transparent"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : volume < 50 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="relative w-full h-1 group">
                <div className="w-full h-1 bg-zinc-600 rounded-full" />
                <div
                  className="absolute top-0 left-0 h-1 bg-[#1db954] rounded-full"
                  style={{ width: `${volume}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${volume}% - 6px)` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  step={1}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setVolume(value);
                    setIsMuted(value === 0);
                  }}
                  className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer z-10"
                />
              </div>
              <span className="text-xs text-white w-[30px] text-right">{volume}</span>
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
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            if (loop && audioRef.current) {
              const audio = audioRef.current;
              audio.pause();
              setIsPlaying(false);
              setCurrentTime(0);
              setDuration(0);
              audio.currentTime = 0;
              setTimeout(() => {
                audio.play().then(() => {
                  setIsPlaying(true);
                  setDuration(audio.duration || 0);
                });
              }, 10);
            } else {
              setIsPlaying(false);
              setCurrentTime(0);
              setDuration(0);
              playNext();
            }
          }}
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
