import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import AlbumDialog from "./AlbumDialog";
import { useState } from "react";
import { useAlbums, useDeleteAlbum } from "@/hooks/useAlbums";
import type { Album } from "@/utils/types";
import Loader from "../Loader";
import { Link } from "react-router-dom";

const fallbackImg = "/Note.jpg";

const AlbumLibrary = () => {
    const [open, setOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [filter, setFilter] = useState(""); // Filter input state

    const { albums, isLoading, refetch } = useAlbums();
    const deleteAlbumMutation = useDeleteAlbum();

    const handleAddAlbum = () => {
        setEditingAlbum(null);
        setOpen(true);
    };

    const handleEditAlbum = (album: Album) => {
        setEditingAlbum(album);
        setOpen(true);
    };

    const handleDeleteAlbum = (albumId: string) => {
        deleteAlbumMutation.mutate(albumId, {
            onSuccess: () => {
                refetch();
            },
        });
    };

    // FILTERED ALBUMS LOGIC
    const filteredAlbums = !filter.trim()
        ? albums
        : albums?.filter((album) =>
            album.title.toLowerCase().includes(filter.trim().toLowerCase())
        );

    return (
        <div className="w-full space-y-4 mx-auto">
            {/* Header */}
            <div className="grid grid-cols-[40px_3fr_2fr_1fr_1fr] items-start">
                <div className="col-span-4">
                    <h2 className="text-xl font-bold">Album Library</h2>
                    <p className="text-sm text-zinc-400 mt-1">Manage your Albums</p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleAddAlbum} className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md">
                        + Add Album
                    </Button>
                </div>
            </div>

            {/* --- FILTER INPUT --- */}
            <div className="flex items-center justify-end mb-2 px-1">
                <Input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by album title..."
                    className="w-64 bg-zinc-900 border-none focus:ring-0 focus:outline-none text-white"
                />
            </div>

            {/* Horizontal Scroll Wrapper */}
            <ScrollArea className="w-full overflow-auto md:max-w-full">
                <div className="min-w-[700px] mt-5">
                    {/* Column Headers */}
                    <div className="grid grid-cols-[40px_3fr_2fr_1fr_1fr] text-sm text-zinc-400 border-b px-3 border-zinc-800 pb-2 font-bold">
                        <div>#</div>
                        <div>Album</div>
                        <div>Artist</div>
                        <div className="text-center">Release Date</div>
                        <div className="flex justify-end">Actions</div>
                    </div>

                    {/* Scrollable Album List */}
                    <ScrollArea className="h-[400px] w-full px-3">
                        <div className="space-y-2">
                            {isLoading ? (

                                <Loader />
                            ) : filteredAlbums && filteredAlbums.length > 0 ? (
                                filteredAlbums.map((album: Album, index: number) => (
                                    <div
                                        key={album._id || album.title + index}
                                        className="grid grid-cols-[40px_3fr_2fr_1fr_1fr] items-center border-b border-zinc-900 py-3 text-sm"
                                    >
                                        <div className="text-zinc-400">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <img
                                                src={album.coverImage || fallbackImg}
                                                alt={album.title}
                                                className="w-10 h-10 rounded object-cover shrink-0"
                                            />
                                            <div className="flex flex-col overflow-hidden">
                                                <Link to={`/album/${album._id}`} className="text-sm text-white hover:underline">
                                                    <span className="font-bold text-white truncate">{album.title}</span>
                                                </Link>
                                                <span className="text-xs text-zinc-400 truncate">
                                                    {album.totalSongs === 1
                                                        ? "1 song"
                                                        : `${album.totalSongs} songs`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-zinc-300 truncate font-semibold flex items-center gap-2">
                                            <img
                                                src={album.artistImage || fallbackImg}
                                                alt={album.title}
                                                className="w-5 h-5 rounded object-cover shrink-0"
                                            />
                                            {album.artist}
                                        </div>

                                        <div className="text-zinc-300 font-semibold text-center">
                                            {album.releaseDate
                                                ? album.releaseDate.slice(0, 10)
                                                : "--"}
                                        </div>

                                        <div className="flex gap-3 justify-end">
                                            <Pencil
                                                onClick={() => handleEditAlbum(album)}
                                                className="w-4 h-4 cursor-pointer text-blue-400 hover:text-blue-500"
                                            />
                                            <Trash2
                                                onClick={() => handleDeleteAlbum(album._id!)}
                                                className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600"
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-40 text-zinc-400 col-span-5">
                                    No albums found.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <AlbumDialog
                open={open}
                onOpenChange={setOpen}
                defaultValues={editingAlbum || undefined}
            />
        </div>
    );
};

export default AlbumLibrary;
