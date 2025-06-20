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
  openOnboarding: () => void;
}

function shuffle<T>(array: T[]): T[] {
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
      openOnboarding();
      return;
    }
    playSingle(song);
  };

  const shuffledSongs = useMemo(() => {
    if (!songs) return [];
    return shuffle(songs);
  }, [songs]);

  const visibleSongs = showAll
    ? shuffledSongs.slice(0, 10)
    : shuffledSongs.slice(0, 5);

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
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {visibleSongs.map((song) => (
            <div
              key={song._id}
              className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden group hover:bg-zinc-800 transition-colors w-full max-w-[220px] mx-auto p-4 flex flex-col cursor-pointer"
              onClick={() => handlePlay(song)}
            >
              <div className="relative aspect-square w-full mb-2">
                <img
                  src={song.songImage}
                  alt={song.title}
                  className="w-full h-full object-cover rounded-md"
                  draggable={false}
                />
                <button
                  className="absolute bottom-2 right-2 w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md"
                  onClick={e => {
                    e.stopPropagation();
                    handlePlay(song);
                  }}
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
              <div className="px-0 pt-2 pb-0 flex flex-col gap-1">
                {/* Tooltip wrapper for song name */}
                <div className="relative group/tooltip">
                  <Link
                    to={`/songs/${song._id}`}
                    className="block w-full font-bold text-lg text-white truncate whitespace-nowrap group-hover:underline group-hover:text-white transition"
                    onClick={e => e.stopPropagation()}
                  >
                    {song.title}
                  </Link>
                  {/* Tooltip */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 z-20 min-w-[120px] max-w-xs px-3 py-1 rounded-md bg-zinc-950 text-white text-xs font-semibold shadow-lg pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-pre-line mt-1"
                    style={{ top: '110%' }}
                  >
                    {song.title}
                  </div>
                </div>
                <span className="text-zinc-400 text-sm break-words whitespace-normal">
                  {song.artist}
                </span>
                {song.album && (
                  <span className="text-zinc-400 text-xs font-medium mt-1 break-words whitespace-normal">
                    <Link
                      to={`/album/${song.album}`}
                      className="hover:underline hover:text-white transition"
                      onClick={e => e.stopPropagation()}
                    >
                      {song.albumTitle}
                    </Link>
                  </span>
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
