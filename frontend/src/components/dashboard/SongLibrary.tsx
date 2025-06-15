import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import SongDialog from "./SongDialog";
import { useDeleteSong, useSongs } from "@/hooks/useSongs";
import type { Song } from "@/utils/types";
import { formatDuration } from "@/utils/formatDuration";
import Loader from "../Loader";

const fallbackImg = "/Note.jpg";

const SongLibrary = () => {
  const [open, setOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const { songs, isLoading, refetch } = useSongs();

  const deleteSongMutation = useDeleteSong();

  const handleAddSong = () => {
    setEditingSong(null);
    setOpen(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setOpen(true);
  };

  const handleDeleteSong = (songId: string) => {
    deleteSongMutation.mutate(songId, {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        console.error("Failed to delete song:", error);
      },
    });
  };



  return (
    <div className="w-full space-y-4 mx-auto">
      {/* Header aligned with grid columns */}
      <div className="grid grid-cols-[40px_2fr_2fr_1fr_1fr] items-start">
        <div className="col-span-4">
          <h2 className="text-xl font-bold">Song Library</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage your music tracks</p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAddSong}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md"
          >
            + Add Songs
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <ScrollArea className="w-full overflow-auto md:max-w-full">
        <div className="min-w-[700px]">
          {/* Column headers */}
          <div className="grid grid-cols-[40px_2fr_2fr_1fr_1fr] text-sm text-zinc-400 border-b px-3 border-zinc-800 pb-2 font-bold">
            <div>#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="text-center">Duration</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {/* Scrollable song list */}
          <ScrollArea className="h-[400px] w-full px-3">
            <div className="space-y-2">

              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader />
                </div>
              ) : songs && songs.length > 0 ? (
                songs.map((song: Song, index: number) => (
                  <div
                    key={song._id || `${song.title}-${index}`}
                    className="grid grid-cols-[40px_2fr_2fr_1fr_1fr] items-center border-b border-zinc-900 py-3 text-sm"
                  >
                    <div className="text-zinc-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={song.songImage || fallbackImg}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover shrink-0"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-white truncate">{song.title}</span>
                        <span className="text-xs text-zinc-400 truncate">
                          {song.artist}
                        </span>
                      </div>
                    </div>

                    <div className="text-zinc-300 truncate font-semibold">
                      {song.albumTitle?.trim()
                        ? song.albumTitle
                        : song.album?.trim()
                          ? song.album
                          : "No album"}
                    </div>
                    <div className="text-zinc-300 text-center font-semibold">
                      {song.duration ? formatDuration(song.duration) : "--:--"}
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Pencil
                        onClick={() => handleEditSong(song)}
                        className="w-4 h-4 cursor-pointer text-blue-400 hover:text-blue-500"
                      />
                      <Trash2
                        onClick={() => handleDeleteSong(song._id!)}
                        className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-40 text-zinc-400 col-span-5">
                  No songs found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Add or Edit Dialog */}
      <SongDialog
        open={open}
        onOpenChange={setOpen}
        defaultValues={
          editingSong
            ? {
              ...editingSong,
              album: editingSong.album ?? undefined, // converts null to undefined
            }
            : undefined
        }
      />
    </div>
  );
};

export default SongLibrary;
