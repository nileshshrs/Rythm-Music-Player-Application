import React from "react";


import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { formatDuration } from "@/utils/formatDuration";
import { useSongByID } from "@/hooks/useSongs";
import Loader from "@/components/Loader";
import { useAddSongToPlaylist, useUserPlaylists } from "@/hooks/usePlaylist";
import { useMusicContext } from "@/context/MusicContext"; // Add this line
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Song } from "@/utils/types";
import Onboarding from "@/components/Onboarding";

const Songs = () => {
  const { id } = useParams<{ id: string }>();
  const { song, isLoading, isError } = useSongByID(id || "");
  const { playlists } = useUserPlaylists();
  const addSongToPlaylistMutation = useAddSongToPlaylist();
  const { isAuthenticated } = useAuth()
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { playSingle } = useMusicContext(); // Get the playSingle function

  const openOnboarding = () => setOnboardingOpen(true);
  const handlePlay = (song: Song) => {
    if (!isAuthenticated) {
      openOnboarding(); // <--- just call the prop
      return;
    }
    playSingle(song);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !song) {
    return <div className="text-center text-red-500 py-10">Failed to load song.</div>;
  }

  return (
    <div className="h-[80.1vh] overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md">
      <ScrollArea className="h-full overflow-y-auto rounded-md">
        <div className="relative min-h-full pb-40">
          <div
            className="absolute inset-0 bg-gradient-to-b via-zinc-900/80 to-zinc-900 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${song.themeColor || "#5038aa"}cc, rgba(24,24,27,0.8), #18181b)`,
            }}
          />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 pt-10 pb-8">
              <img
                src={song.songImage}
                alt={song.title}
                className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] shadow-2xl rounded-lg"
              />
              <div className="text-zinc-300 text-center md:text-left space-y-4">
                <p className="text-sm uppercase text-zinc-400 font-medium">Song</p>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">{song.title}</h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-zinc-200 font-medium">
                  <span className="text-zinc-300 font-semibold">{song.artist}</span>
                  <span>&bull;</span>
                  <span>{formatDuration(song.duration)}</span>
                  {song.album && song.albumTitle && (
                    <>
                      <span>&bull;</span>
                      <Link
                        to={`/album/${song.album}`}
                        className="text-emerald-400 hover:underline hover:text-white"
                      >
                        {song.albumTitle}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pb-4 flex gap-4 items-center justify-center md:justify-start">
              <Button
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 transition duration-200 transform hover:scale-105 flex items-center justify-center p-0"
                onClick={() => handlePlay(song)} // <<-- Add this
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111827" className="w-8 h-8">
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center p-0"
                    title="Add to Playlist"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[220px] mt-2 bg-[#18181b] text-sm text-[#fefefe] font-semibold rounded-md p-0 border border-white/10 shadow-[0_2px_8px_rgba(255,255,255,0.03)]"
                >
                  <div className="px-3 py-2 text-[14px] select-none border-b border-zinc-800">
                    Your Playlists
                  </div>
                  <ScrollArea className="h-32 w-full">
                    <div className="p-1 ">
                      {playlists && playlists.length > 0 ? (
                        playlists.map((playlist: any) => (
                          <div
                            key={playlist._id}
                            onClick={() => {
                              addSongToPlaylistMutation.mutate({
                                playlistId: playlist._id,
                                songId: song._id,
                              });
                            }}
                            className="px-3 py-2 text-[13px] cursor-pointer hover:bg-zinc-800/40 hover:text-white rounded transition-colors"
                          >
                            {playlist.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-zinc-400">No playlists found.</div>
                      )}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="hidden md:grid grid-cols-[16px_5fr_2fr_1fr] gap-4 px-10 pt-2 text-sm font-semibold text-zinc-400 border-b border-zinc-700/5">
              <div>#</div>
              <div>Title</div>
              <div>Artist</div>
              <div><Clock className="h-4 w-4" /></div>
            </div>
            <div className="grid md:hidden grid-cols-[16px_1fr_1fr_1fr] gap-2 px-4 pt-2 text-sm font-semibold text-zinc-400 border-b border-zinc-700/5">
              <div>#</div>
              <div>Title</div>
              <div>Artist</div>
              <div><Clock className="h-4 w-4" /></div>
            </div>

            <div className="px-4 md:px-10">
              <div className="space-y-2 py-4">
                <div className="group hidden md:grid grid-cols-[16px_5fr_2fr_1fr] gap-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors">
                  <div className="text-zinc-400 font-medium flex items-center justify-center w-4">1</div>
                  <div className="truncate font-medium">
                    <span className="text-zinc-100 hover:text-green-400 hover:underline transition-colors">
                      {song.title}
                    </span>
                  </div>
                  <div className="truncate text-zinc-300 font-normal">{song.artist}</div>
                  <div className="text-zinc-400 font-medium">{formatDuration(song.duration)}</div>
                </div>

                <div className="group grid md:hidden grid-cols-[16px_1fr_1fr_1fr] gap-2 py-3 text-sm text-zinc-200 border-b border-zinc-700/50">
                  <div className="text-zinc-400 font-medium flex items-center justify-center w-4">1</div>
                  <div className="truncate font-medium">
                    <span className="text-zinc-100 hover:text-green-400 hover:underline transition-colors">
                      {song.title}
                    </span>
                  </div>
                  <div className="truncate text-zinc-300 font-normal">{song.artist}</div>
                  <div className="text-zinc-400 font-medium">{formatDuration(song.duration)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <Onboarding open={onboardingOpen} onOpenChange={setOnboardingOpen} />
    </div>
  );
};

export default Songs;
