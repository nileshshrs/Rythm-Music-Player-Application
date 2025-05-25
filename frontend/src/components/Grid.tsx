import React from "react";
import { Button } from "./ui/button";
import GridSkeleton from "./skeletons/GridSkeleton";
import { Song } from "@/utils/types";

interface GridProps {
  title: string;
  songs: Song[] | undefined;
  isLoading: boolean;
}

const Grid: React.FC<GridProps> = ({ title, songs, isLoading }) => {
  return (
    <div className="mb-8">
      {/* Section Title + Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        <Button variant="link" className="text-sm text-zinc-400 hover:text-white">
          Show all
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <GridSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs?.slice(0, 8).map((song) => (
            <div
              key={song._id}
              className="bg-[#1c1c1e] hover:bg-[#18181b] rounded-lg p-4 cursor-pointer"
            >
              <img
                src={song.songImage}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md mb-4"
              />
              <h3 className="text-white font-semibold text-sm truncate">{song.title}</h3>
              <p className="text-zinc-400 text-xs truncate">{song.artist}</p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Grid;
