import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import GridSkeleton from "./skeletons/GridSkeleton";
import { Song } from "@/utils/types";
import { Link } from "react-router-dom";
import { useMusicContext } from "@/context/MusicContext";
import { useAuth } from "@/context/AuthContext";

interface GridProps {
  title: string;
  songs: Song[] | undefined;
  isLoading: boolean;
  openOnboarding: () => void; // <--- Add this prop
}

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Grid: React.FC<GridProps> = ({ title, songs, isLoading, openOnboarding }) => {
  const [showAll, setShowAll] = useState(false);
  const { playSingle } = useMusicContext();
  const { isAuthenticated } = useAuth();

  const handlePlay = (song: Song) => {
    if (!isAuthenticated) {
      openOnboarding(); // <--- just call the prop
      return;
    }
    playSingle(song);
  };

  // Shuffle and memoize
  const shuffledSongs = useMemo(() => {
    if (!songs) return [];
    return shuffle(songs);
  }, [songs]);

  const visibleSongs = showAll
    ? shuffledSongs.slice(0, 8)
    : shuffledSongs.slice(0, 4);

  return (
    <div className="mb-8">
      {/* Section Title + Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-400 hover:text-white"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : "Show all"}
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <GridSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleSongs.map((song) => (
            <div
              key={song._id}
              className="bg-[#1c1c1e] hover:bg-[#18181b] rounded-lg p-4 cursor-pointer group"
              onClick={() => handlePlay(song)}
            >
              {/* Song image + play button */}
              <div className="relative mb-4">
                <img
                  src={song.songImage}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <button
                  className="absolute bottom-2 right-2 w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md"
                  onClick={() => handlePlay(song)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-black"
                  >
                    <path d="M5 3v18l15-9L5 3z" />
                  </svg>
                </button>
              </div>

              {/* Song title */}
              <Link
                to={`/songs/${song._id}`}
                className="block text-white font-semibold text-sm truncate whitespace-nowrap group-hover:underline group-hover:text-white transition"
                onClick={e => e.stopPropagation()}
              >
                {song.title}
              </Link>

              {/* Artist + View Album */}
              <div className="text-zinc-400 text-xs truncate flex items-center gap-x-1.5">
                <span className="truncate">{song.artist}</span>
                {song.album && (
                  <>
                    <span>&bull;</span>
                    <Link
                      to={`/album/${song.album}`}
                      className="text-zinc-400 whitespace-nowrap hover:underline hover:text-white transition"
                      onClick={e => e.stopPropagation()}
                    >
                      {song.albumTitle}
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Grid;
