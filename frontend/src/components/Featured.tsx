import { useSongs } from "@/hooks/useSongs";
import FeaturedSkeleton from "./skeletons/FeaturedSkeleton";
import { Song } from "@/utils/types";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const shuffleArray = (array: Song[]): Song[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Featured = () => {
  const { songs = [], isLoading, isError } = useSongs();

  const randomSix = useMemo(() => {
    return shuffleArray(songs).slice(0, 6);
  }, [songs]);

  if (isLoading) return <FeaturedSkeleton />;
  if (isError) return <div className="text-zinc-400">Failed to load songs.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {randomSix.map((song: Song) => (
        <div
          key={song._id}
          className="flex items-center bg-[#1c1c1e] hover:bg-[#18181b] transition-colors duration-200 rounded-sm overflow-hidden px-4 py-3 group"
        >
          {/* Song image with play button */}
          <div className="relative w-16 sm:w-20 h-16 sm:h-20 shrink-0">
            <img
              src={song.songImage}
              alt={song.title}
              className="w-full h-full object-cover rounded-sm"
            />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[10px] h-[10px] text-black"
              >
                <path d="M5 3v18l15-9L5 3z" />
              </svg>
            </div>
          </div>

          {/* Song info */}
          <div className="flex-1 pl-4 space-y-1 overflow-hidden">
            <Link
              to={`/songs/${song._id}`}
              className="block text-sm font-semibold text-white truncate group-hover:underline group-hover:text-white"
            >
              {song.title}
            </Link>
            <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Featured;
