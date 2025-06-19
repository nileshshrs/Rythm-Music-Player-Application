import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Shuffle,
    MoreHorizontal,
    Pencil,
    Trash2,
    Clock,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeletePlaylist, usePlaylistById, useUpdatePlaylist } from "@/hooks/usePlaylist";
import { useUploadImage } from "@/hooks/useImage";
import { useMusicContext } from "@/context/MusicContext";
import EditPlaylist from "@/components/EditPlaylist";
import Loader from "@/components/Loader";
import { formatDuration } from "@/utils/formatDuration";
import { Song } from "@/utils/types";

const fallbackImg = "/Note.jpg";

const Playlist = () => {
    // For Edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    // For image upload and local preview
    const { mutate: uploadImage } = useUploadImage();
    const { mutate: updatePlaylist } = useUpdatePlaylist();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // For instant local preview
    const [localCover, setLocalCover] = useState<string | null>(null);
    const prevCoverRef = useRef<string | undefined>(undefined);

    const { id } = useParams();
    const { data: playlist, isLoading } = usePlaylistById(id);
    const { playAlbum, playSingle, currentSong } = useMusicContext();
    const { mutate: deletePlaylist } = useDeletePlaylist();

    // Handle flicker-free transition to backend image
    useEffect(() => {
        // Only clear the local preview if the backend cover image has changed
        if (
            prevCoverRef.current !== playlist?.coverImage &&
            localCover // Only if a preview was shown
        ) {
            setLocalCover(null);
        }
        prevCoverRef.current = playlist?.coverImage;
    }, [playlist?.coverImage, localCover]);

    if (isLoading || !playlist) return <Loader />;

    function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file && playlist._id) {
            const prevCover = playlist.coverImage || "";

            // Show local preview instantly
            const reader = new FileReader();
            reader.onload = () => {
                setLocalCover(reader.result as string);

                // Start uploading
                uploadImage(file, {
                    onSuccess: (imageUrl: string) => {
                        updatePlaylist(
                            {
                                playlistId: playlist._id,
                                data: { coverImage: imageUrl },
                            },
                            {
                                // Only let backend image show after change is detected (handled in useEffect)
                                onSuccess: () => { },
                                onError: () => setLocalCover(prevCover),
                            }
                        );
                    },
                    onError: () => setLocalCover(prevCover),
                });
            };
            reader.readAsDataURL(file);
        }
    }

    // Always use a cache buster on backend image to force reload after update
    const backendCover = playlist.coverImage?.trim()
        ? playlist.coverImage + "?t=" + encodeURIComponent(playlist.updatedAt || Date.now())
        : fallbackImg;

    return (
        <div className="h-[80.1vh] overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md">
            <ScrollArea className="h-full overflow-y-auto rounded-md">
                <div className="relative min-h-full pb-40">
                    <div
                        className="absolute inset-0 bg-gradient-to-b via-zinc-900/80 to-zinc-900 pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(to bottom, ${playlist?.themeColor || "#5038aa"}cc, rgba(24,24,27,0.8), #18181b)`,
                        }}
                    />

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 pt-10 pb-8">
                            {/* ---- Cover image with overlay ---- */}
                            <div className="relative group w-[200px] h-[200px] md:w-[240px] md:h-[240px] shadow-2xl rounded-lg overflow-hidden">
                                <img
                                    src={
                                        localCover !== null
                                            ? localCover
                                            : backendCover
                                    }
                                    alt="Playlist Cover"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                {/* Hover overlay for editing */}
                                <div
                                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                    <span className="mt-2 text-white font-semibold text-sm drop-shadow">Change cover</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                                    style={{ display: "none" }}
                                    onChange={handleCoverImageChange}
                                    aria-label="Change playlist cover image"
                                />
                            </div>

                            {/* ---- End Cover image ---- */}

                            <div className="text-zinc-300 text-center md:text-left space-y-4">
                                <p className="text-sm uppercase text-zinc-400 font-medium">Playlist</p>
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight">{playlist.name}</h1>
                                {/* ---- Description ---- */}
                                {playlist.description && (
                                    <p className="text-base text-zinc-400 max-w-xl mx-auto md:mx-0 break-words whitespace-pre-line">
                                        {playlist.description}
                                    </p>
                                )}
                                {/* -------------------- */}
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <span className="text-zinc-300 font-semibold">{playlist.username}</span>
                                    <span>&bull;</span>
                                    <span>{playlist.songs.length} songs</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-4 flex gap-4 items-center justify-center md:justify-start">
                            <Button
                                onClick={() => {
                                    if (playlist.songs.length > 0) playAlbum(playlist.songs);
                                }}
                                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-xl transition duration-200 transform hover:scale-105 flex items-center justify-center p-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111827" className="w-8 h-8">
                                    <path d="M5 3v18l15-9L5 3z" />
                                </svg>
                            </Button>

                            <Button
                                onClick={() => {
                                    if (playlist.songs.length > 1) {
                                        const randomIndex = Math.floor(Math.random() * playlist.songs.length);
                                        playAlbum(playlist.songs, randomIndex);
                                    }
                                }}
                                className="w-10 h-10 mt-[2px] rounded-full bg-zinc-700 hover:bg-zinc-600 shadow-xl transition duration-200 transform hover:scale-105 flex items-center justify-center p-0"
                            >
                                <Shuffle className="w-5 h-5 text-white" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="w-10 h-10 mt-[2px] rounded-full bg-zinc-700 hover:bg-zinc-600 shadow-xl transition duration-200 transform hover:scale-105 flex items-center justify-center p-0"
                                    >
                                        <MoreHorizontal className="w-5 h-5 text-white" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="bottom"
                                    align="start"
                                    sideOffset={10}
                                    alignOffset={10}
                                    className="w-32 bg-zinc-800 hover:bg-zinc-800/40 text-white rounded-md px-1 py-1 text-sm font-medium shadow-xl border-none"
                                >
                                    <DropdownMenuItem
                                        onClick={() => setEditDialogOpen(true)}
                                        className="flex items-center justify-between px-2 py-2 !text-white bg-zinc-800 hover:bg-zinc-800/40 focus:bg-zinc-800/40 rounded outline-none focus:ring-0 focus:outline-none"
                                    >
                                        <span className="!text-white">Edit</span>
                                        <Pencil className="w-4 h-4 ml-2 !text-white" />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => {
                                            if (playlist._id) deletePlaylist(playlist._id);
                                        }}
                                        className="flex items-center justify-between px-2 py-2 !text-white bg-zinc-800 hover:bg-zinc-800/40 focus:bg-zinc-800/40 rounded outline-none focus:ring-0 focus:outline-none"
                                    >
                                        <span className="!text-white">Delete</span>
                                        <Trash2 className="w-4 h-4 ml-2 !text-white" />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Table headers (desktop) */}
                        <div className="hidden md:grid grid-cols-[16px_5fr_2fr_1fr] gap-4 px-10 pt-2 text-sm font-semibold text-zinc-400 border-b border-zinc-700/5">
                            <div>#</div>
                            <div>Title</div>
                            <div>Artist</div>
                            <div>
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Table headers (mobile) */}
                        <div className="grid md:hidden grid-cols-[16px_1fr_1fr_1fr] gap-2 px-4 pt-2 text-sm font-semibold text-zinc-400 border-b border-zinc-700/5">
                            <div>#</div>
                            <div>Title</div>
                            <div>Artist</div>
                            <div>
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="px-4 md:px-10">
                            <div className="space-y-2 py-4">
                                {playlist.songs.map((song: Song, index: number) => {
                                    const isCurrent = currentSong?._id === song._id;
                                    return (
                                        <React.Fragment key={song._id}>
                                            <div className="group hidden md:grid grid-cols-[16px_5fr_2fr_1fr] gap-4 py-3 text-sm text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors">
                                                <div className="text-zinc-400 font-medium flex items-center justify-center relative w-4">
                                                    {isCurrent ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-green-400" viewBox="0 0 24 24">
                                                            <path d="M5 3v18l15-9L5 3z" />
                                                        </svg>
                                                    ) : (
                                                        <>
                                                            <span className="group-hover:hidden block">{index + 1}</span>
                                                            <span className="hidden group-hover:flex pl-1.5 cursor-pointer" onClick={() => playSingle(song)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-zinc-300" viewBox="0 0 24 24">
                                                                    <path d="M5 3v18l15-9L5 3z" />
                                                                </svg>
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="truncate font-medium">
                                                    <Link to={`/songs/${song._id}`} className="text-zinc-100 hover:text-green-400 hover:underline transition-colors">
                                                        {song.title}
                                                    </Link>
                                                </div>
                                                <div className="truncate text-zinc-300 font-normal">{song.artist}</div>
                                                <div className="text-zinc-400 font-medium">{formatDuration(song.duration)}</div>
                                            </div>

                                            <div className="group grid md:hidden grid-cols-[16px_1fr_1fr_1fr] gap-2 py-3 text-sm text-zinc-200 border-b border-zinc-700/50">
                                                <div className="text-zinc-400 font-medium flex items-center justify-center relative w-4">
                                                    {isCurrent ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-green-400" viewBox="0 0 24 24">
                                                            <path d="M5 3v18l15-9L5 3z" />
                                                        </svg>
                                                    ) : (
                                                        <>
                                                            <span className="group-hover:hidden block">{index + 1}</span>
                                                            <span className="hidden group-hover:flex pl-1.5 cursor-pointer" onClick={() => playSingle(song)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-zinc-300" viewBox="0 0 24 24">
                                                                    <path d="M5 3v18l15-9L5 3z" />
                                                                </svg>
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="truncate font-medium">
                                                    <Link to={`/songs/${song._id}`} className="text-zinc-100 hover:text-green-400 hover:underline transition-colors">
                                                        {song.title}
                                                    </Link>
                                                </div>
                                                <div className="truncate text-zinc-300 font-normal">{song.artist}</div>
                                                <div className="text-zinc-400 font-medium">{formatDuration(song.duration)}</div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <EditPlaylist
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                initialName={playlist.name}
                initialDescription={playlist.description}
                initialThemeColor={playlist.themeColor}
                initialCoverImage={playlist.coverImage}
            />
        </div>
    );
};

export default Playlist;
