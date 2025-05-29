import React, { useState } from "react";
import { Button } from "./ui/button";
import GridSkeleton from "./skeletons/GridSkeleton";
import { Song } from "@/utils/types";
import { Link } from "react-router-dom";

interface GridProps {
  title: string;
  songs: Song[] | undefined;
  isLoading: boolean;
}

const Grid: React.FC<GridProps> = ({ title, songs, isLoading }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleSongs = showAll ? songs?.slice(0, 8) : songs?.slice(0, 4);

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
          {visibleSongs?.map((song) => (
            <div
              key={song._id}
              className="bg-[#1c1c1e] hover:bg-[#18181b] rounded-lg p-4 cursor-pointer group"
            >
              {/* Song image + play button */}
              <div className="relative mb-4">
                <img
                  src={song.songImage}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md">
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
                      onClick={(e) => e.stopPropagation()}
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
