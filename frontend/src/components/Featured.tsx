import { useSongs } from "@/hooks/useSongs";
import FeaturedSkeleton from "./skeletons/FeaturedSkeleton";
import { Song } from "@/utils/types";

const Featured = () => {
  const { songs, isLoading, isError } = useSongs();

  if (isLoading) return <FeaturedSkeleton />;
  if (isError) return <div className="text-zinc-400">Failed to load songs.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {songs?.map((song: Song) => (
        <div
          key={song._id}
          className="flex items-center bg-[#1c1c1e] hover:bg-[#18181b] transition-colors duration-200 rounded-sm overflow-hidden px-4 py-3"
        >
          {/* Song image */}
          <img
            src={song.songImage}
            alt={song.title}
            className="w-16 sm:w-20 h-16 sm:h-20 rounded-sm object-cover flex-shrink-0"
          />

          {/* Song info */}
          <div className="flex-1 pl-4 space-y-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{song.title}</p>
            <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Featured;
