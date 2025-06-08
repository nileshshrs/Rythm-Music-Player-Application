import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Pencil, Trash2 } from "lucide-react";
import AlbumDialog from "./AlbumDialog";
import { useState } from "react";

const albums = [
    {
        id: 1,
        name: "Inner Light",
        artist: "Shocking Lemon",
        duration: "2H+",
        totalSongs: 10,
        image: "/Note.jpg",
    },
    {
        id: 2,
        name: "Lost in Tokyo",
        artist: "Electric Dreams",
        duration: "1H 30M",
        totalSongs: 17,
        image: "/Note.jpg",
    },
    {
        id: 3,
        name: "Night Pulse",
        artist: "Synth Wave",
        duration: "45M",
        totalSongs: 8,
        image: "/Note.jpg",
    },
    {
        id: 4,
        name: "Ocean Drive",
        artist: "Waveform",
        duration: "3H",
        totalSongs: 22,
        image: "/Note.jpg",
    },
];

const AlbumLibrary = () => {
    const [open, setOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<any | null>(null);

    const handleAddAlbum = () => {
        setEditingAlbum(null);
        setOpen(true);
    };

    const handleEditAlbum = (album: any) => {
        setEditingAlbum(album);
        setOpen(true);
    };
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

            {/* Horizontal Scroll Wrapper */}
            <ScrollArea className="w-full overflow-auto md:max-w-full">
                <div className="min-w-[700px]"> {/* Force horizontal scroll on small screens */}
                    {/* Column Headers */}
                    <div className="grid grid-cols-[40px_3fr_2fr_1fr_1fr] text-sm text-zinc-400 border-b px-3 border-zinc-800 pb-2 font-bold">
                        <div>#</div>
                        <div>Album</div>
                        <div>Artist</div>
                        <div className="text-center">Total Songs</div>
                        <div className="flex justify-end">Actions</div>
                    </div>

                    {/* Scrollable Album List */}
                    <ScrollArea className="h-[400px] w-full px-3">
                        <div className="space-y-2">
                            {albums.map((album, index) => (
                                <div
                                    key={`${album.id}-${index}`}
                                    className="grid grid-cols-[40px_3fr_2fr_1fr_1fr] items-center border-b border-zinc-900 py-3 text-sm"
                                >
                                    <div className="text-zinc-400">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <img
                                            src={album.image}
                                            alt={album.name}
                                            className="w-10 h-10 rounded object-cover shrink-0"
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-white truncate">{album.name}</span>
                                            <span className="text-xs text-zinc-400 truncate">{album.duration}</span>
                                        </div>
                                    </div>

                                    <div className="text-zinc-300 truncate font-semibold">
                                        {album.artist}
                                    </div>

                                    <div className="text-zinc-300 font-semibold text-center">{album.totalSongs}</div>

                                    <div className="flex gap-3 justify-end">
                                        <Pencil
                                            onClick={() => handleEditAlbum(album)}
                                            className="w-4 h-4 cursor-pointer text-blue-400 hover:text-blue-500"
                                        />
                                        <Trash2 className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600" />

                                    </div>
                                </div>
                            ))}
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
