import { useState } from "react";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import PlaylistSkeleton from "./skeletons/PlaylistSkeleton";
import PlaylistImage from "@/components/PlaylistImage";
import { useCreatePlaylist, useUserPlaylists } from "@/hooks/usePlaylist";
import { useAuth } from "@/context/AuthContext";
import Prompt from "@/components/Prompt"; // <-- Add this import

const LeftSidebar = () => {
  const { playlists, isLoading, isError, error } = useUserPlaylists();
  const { mutate: createPlaylist, isPending, isError: isCreateError } = useCreatePlaylist();
  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const handleCreate = () => {
    if (user) createPlaylist();
    return;
  };

  return (
    <div className="h-[88vh] flex flex-col gap-2 @container ">
      {/* Navigation */}
      <div className="rounded-lg bg-zinc-900 px-3 py-4 sm:p-4">
        <nav className="space-y-2">
          <Link
            to="/"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full flex items-center text-white/90 hover:text-white hover:bg-zinc-900 @[130px]:justify-start justify-center px-1",
              })
            )}
          >
            <img src="/logo.png" alt="" className="w-9 h-9" />
            <span className="hidden @[130px]:inline text-[13px] sm:text-[1rem] font-bold tracking-tight leading-none">
              RHYTHM
            </span>
          </Link>

          <Link
            to="/"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full flex items-center text-white/90 hover:text-white hover:bg-zinc-800 @[130px]:justify-start justify-center",
              })
            )}
          >
            <HomeIcon className="size-6 @[130px]:mr-2" />
            <span className="hidden @[130px]:inline text-[13px] sm:text-sm font-medium tracking-tight leading-none">
              Home
            </span>
          </Link>

          <Link
            to="/messages"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full flex items-center text-white/90 hover:text-white hover:bg-zinc-800 @[130px]:justify-start justify-center",
              })
            )}
          >
            <MessageCircle className="size-6 @[130px]:mr-2" />
            <span className="hidden @[130px]:inline text-[13px] sm:text-sm font-medium tracking-tight leading-none">
              Messages
            </span>
          </Link>
        </nav>
      </div>

      {/* Library */}
      <div className="flex-1 rounded-lg bg-zinc-900 px-0 py-4 sm:p-4">
        <div className="hidden @[130px]:flex items-center justify-between mb-4 px-1 sm:px-2">
          <div className="inline-flex items-center justify-center text-white/90 font-semibold text-sm sm:text-base tracking-tight">
            <Library className="mr-2 w-5 h-5 text-white relative top-[1px]" strokeWidth={3} />
            <span className="hidden @[265px]:inline leading-none mt-0.5">Your Library</span>
          </div>

          <button
            className="mt-0.5 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-zinc-800 rounded-full text-[13px] sm:text-sm font-medium text-white/90 hover:bg-zinc-700 transition-colors leading-none"
            aria-label="Create Playlist"
            onClick={handleCreate}
            disabled={isPending}
          >
            <svg className="w-[16px] h-[16px] stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden @[265px]:inline">Create</span>
          </button>
        </div>

        <div className="mb-4 flex justify-center @[130px]:hidden">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shadow transition-colors"
            aria-label="Create Playlist"
            onClick={handleCreate}
            disabled={isPending}
          >
            <svg className="w-[16px] h-[16px] stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <Input
          type="text"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hidden @[260px]:block mb-4 h-8 bg-zinc-800 text-white placeholder-zinc-400 border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
        />

        {isCreateError && (
          <p className="text-red-400 text-xs px-2 mb-2">
            Failed to create playlist. Try again.
          </p>
        )}

        <ScrollArea className="h-[calc(70vh-150px)] overflow-y-auto">
          <div className="space-y-1.5 h-full w-full">
            {!user || (Array.isArray(playlists) && playlists.length === 0) ? (

              <Prompt />
            ) : isLoading ? (
              <PlaylistSkeleton />
            ) : isError ? (
              <div className="text-sm text-red-400 px-2">
                Failed to load playlists
              </div>
            ) : (
              playlists
                ?.filter((playlist: any) =>
                  playlist.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((playlist: any) => (
                  <Link
                    to={`/playlist/${playlist._id}`}
                    key={playlist._id}
                    className="flex items-center @[130px]:justify-start justify-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-zinc-700 flex items-center justify-center">
                      <PlaylistImage coverImage={playlist.coverImage} />
                    </div>
                    <div className="hidden @[130px]:flex flex-col min-w-0 max-w-full @[265px]:max-w-none">
                      <span className="hidden @[130px]:inline text-sm font-medium text-white truncate max-w-[160px] @[265px]:max-w-none group-hover:underline">
                        {playlist.name}
                      </span>
                      <span className="hidden @[130px]:inline text-xs text-zinc-400 font-normal truncate max-w-[180px] @[265px]:max-w-none">
                        Playlist • {playlist.username} • {playlist.totalSongs} Song{playlist.totalSongs !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
