import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAlbum } from "@/hooks/useAlbums";
import { formatDuration } from "@/utils/formatDuration";
import { Clock } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import React from "react";
import { Song } from "@/utils/types";

const Album = () => {
  const { id } = useParams();
  const { album, songs, isLoading } = useAlbum(id);

  return (
    <div className="h-[80vh] overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md">
      <ScrollArea className="h-full overflow-y-auto rounded-md">
        <div className="relative min-h-full pb-40">
          {/* Background gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b via-zinc-900/80 to-zinc-900 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${album?.themeColor || "#5038aa"}cc, rgba(24,24,27,0.8), #18181b)`
            }}
          />

          {/* Main content */}
          <div className="relative z-10">
            {/* Album Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 pt-10 pb-8">
              <img
                src={
                  album?.coverImage ||
                  "https://i.scdn.co/image/ab67616d0000b27392d21aef6c0d288cc4c05973"
                }
                alt="Album Cover"
                className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] shadow-2xl rounded-lg"
              />
              <div className="text-zinc-300 text-center md:text-left space-y-4">
                <p className="text-sm uppercase text-zinc-400 font-medium">Album</p>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {album?.title || (isLoading ? "Loading..." : "Untitled Album")}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-zinc-200 font-medium">
                  <span className="text-zinc-300 font-semibold">
                    {album?.artist || "Unknown Artist"}
                  </span>
                  <span>&bull;</span>
                  <span>2025</span>
                  <span>&bull;</span>
                  <span>{songs?.length ?? 0} songs</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="px-6 pb-4 flex justify-center md:justify-start gap-6">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-xl transition duration-200 transform hover:scale-105 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#111827"
                  className="w-8 h-8 ml-[2px]"
                >
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
              </Button>
            </div>

            {/* Header Row - Desktop */}
            <div className="hidden md:grid grid-cols-[16px_5fr_2fr_1fr] gap-4 px-10 pt-2 text-sm font-semibold text-zinc-400 border-b border-zinc-700/5">
              <div>#</div>
              <div>Title</div>
              <div>Artist</div>
              <div>
                <Clock className="h-4 w-4" />
              </div>
            </div>

            {/* Header Row - Mobile */}
            <div className="grid md:hidden grid-cols-[16px_1fr_1fr_1fr] gap-2 px-4 pt-2 text-sm font-semibold text-zinc-400 border-b border-zinc-700/5">
              <div>#</div>
              <div>Title</div>
              <div>Artist</div>
              <div>
                <Clock className="h-4 w-4" />
              </div>
            </div>

            {/* Songs List */}
            <div className="px-4 md:px-10">
              <div className="space-y-2 py-4">
                {songs?.map((song: Song, index: number) => (
                  <React.Fragment key={song._id || index}>
                    {/* Desktop Row */}
                    <div className="group hidden md:grid grid-cols-[16px_5fr_2fr_1fr] gap-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors">
                      <div className="text-zinc-400 font-medium flex items-center justify-center relative w-4">
                        <span className="group-hover:hidden block">{index + 1}</span>
                        <span className="hidden group-hover:flex pl-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 fill-zinc-300"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 3v18l15-9L5 3z" />
                          </svg>
                        </span>
                      </div>
                      <div className="truncate font-medium">
                        <Link
                          to={`/songs/${song._id}`}
                          className="text-zinc-100 hover:text-green-400 hover:underline transition-colors"
                        >
                          {song.title}
                        </Link>
                      </div>
                      <div className="truncate text-zinc-300 font-normal">
                        {song.artist || "Unknown Artist"}
                      </div>
                      <div className="text-zinc-400 font-medium">
                        {formatDuration(song.duration)}
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div className="group grid md:hidden grid-cols-[16px_1fr_1fr_1fr] gap-2 py-3 text-sm text-zinc-200 border-b border-zinc-700/50">
                      <div className="text-zinc-400 font-medium flex items-center justify-center relative w-4">
                        <span className="group-hover:hidden block">{index + 1}</span>
                        <span className="hidden group-hover:flex pl-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 fill-zinc-300"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 3v18l15-9L5 3z" />
                          </svg>
                        </span>
                      </div>
                      <div className="truncate font-medium">
                        <Link
                          to={`/songs/${song._id}`}
                          className="text-zinc-100 hover:text-green-400 hover:underline transition-colors"
                        >
                          {song.title}
                        </Link>
                      </div>
                      <div className="truncate text-zinc-300 font-normal">
                        {song.artist || "Unknown"}
                      </div>
                      <div className="text-zinc-400 font-medium">
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Album;
