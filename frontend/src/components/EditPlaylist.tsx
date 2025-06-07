import React, { useRef, useState, ChangeEvent, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/hooks/useImage";
import { useUpdatePlaylist } from "@/hooks/usePlaylist";
import { useParams } from "react-router-dom";

export interface EditPlaylistProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialName?: string;
    initialDescription?: string;
    initialThemeColor?: string;
    initialCoverImage?: string;
}

const IMAGE_SIZE = 192;

const EditPlaylist: React.FC<EditPlaylistProps> = ({
    open,
    onOpenChange,
    initialName = "",
    initialDescription = "",
    initialThemeColor = "#5038aa",
    initialCoverImage = "",
}) => {
    const { id: playlistId } = useParams();
    const [name, setName] = useState<string>(initialName);
    const [description, setDescription] = useState<string>(initialDescription);
    const [themeColor, setThemeColor] = useState<string>(initialThemeColor);
    const [coverImage, setCoverImage] = useState<string>(initialCoverImage);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { mutate: uploadImage } = useUploadImage();
    const { mutate: updatePlaylist } = useUpdatePlaylist();

    useEffect(() => {
        setName(initialName);
        setDescription(initialDescription);
        setThemeColor(initialThemeColor);
        setCoverImage(initialCoverImage);
        setCoverPreview(null);
    }, [open, initialName, initialDescription, initialThemeColor, initialCoverImage]);

    // Upload image & update playlist immediately on file change
    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setCoverPreview(localUrl);

            uploadImage(file, {
                onSuccess: (imageUrl: string) => {
                    setCoverImage(imageUrl);
                    if (playlistId) {
                        updatePlaylist({
                            playlistId,
                            data: { coverImage: imageUrl },
                        });
                    }
                },
            });
        }
    }

    // Save only updates text fields and theme color, NOT image
    function handleSave() {
        if (playlistId) {
            updatePlaylist({
                playlistId,
                data: {
                    name,
                    description,
                    themeColor,
                },
            });
        }
        onOpenChange(false);
    }

    function handleOpenChange(openValue: boolean) {
        if (!openValue) {
            setName(initialName);
            setDescription(initialDescription);
            setThemeColor(initialThemeColor);
            setCoverImage(initialCoverImage);
            setCoverPreview(null);
        }
        onOpenChange(openValue);
    }

    const imageToShow =
        coverPreview ||
        (coverImage && coverImage.trim().length > 0 ? coverImage : "/Note.jpg");

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="max-w-md rounded-2xl bg-zinc-900 border-none shadow-2xl p-0 overflow-visible"
                style={{ minWidth: 460, minHeight: 370 }}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-white">Edit details</h2>
                    <div className="flex items-start gap-6">
                        {/* Left: Image with hover overlay */}
                        <div
                            className="flex-shrink-0 rounded-lg bg-zinc-800 flex items-center justify-center relative group overflow-hidden"
                            style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                        >
                            <img
                                src={imageToShow}
                                alt="cover preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            {/* Hover Overlay */}
                            <div className="
                                absolute inset-0
                                bg-black/80
                                backdrop-blur-sm
                                opacity-0
                                group-hover:opacity-100
                                group-hover:ring-2
                                group-hover:ring-white/10
                                flex flex-col items-center justify-center
                                transition-all
                                z-10
                                cursor-pointer
                            ">
                                <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                <span className="text-white mt-3 text-base font-semibold drop-shadow-sm">Choose photo</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                aria-label="Upload cover image"
                            />
                        </div>
                        {/* Right: Inputs */}
                        <div className="flex-1 flex flex-col gap-4" style={{ height: IMAGE_SIZE }}>
                            <input
                                className="w-full h-11 bg-zinc-800 text-white rounded-md px-4 py-2 text-base font-medium transition"
                                value={name}
                                maxLength={100}
                                onChange={e => setName(e.target.value)}
                                placeholder="Playlist name"
                                aria-label="Playlist name"
                                style={{
                                    fontWeight: 600,
                                    outline: "none",
                                    boxShadow: "none"
                                }}
                            />

                            <textarea
                                className="w-full h-20 resize-none bg-zinc-800 text-zinc-200 rounded-md px-4 py-2 text-base font-normal transition"
                                value={description}
                                maxLength={300}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Add an optional description"
                                aria-label="Playlist description"
                                style={{
                                    fontWeight: 400,
                                    outline: "none",
                                    boxShadow: "none",
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                    overflowY: "scroll",
                                }}
                            ></textarea>

                            <div className="flex items-center gap-2">
                                <label htmlFor="themeColor" className="text-sm text-zinc-400 mr-1 font-semibold">Theme Color:</label>
                                <input
                                    id="themeColor"
                                    type="color"
                                    value={themeColor}
                                    onChange={e => setThemeColor(e.target.value)}
                                    className="w-7 h-7 border-none outline-none bg-transparent p-0 cursor-pointer"
                                    style={{ borderRadius: 8 }}
                                    title="Pick theme color"
                                />
                                <span className="text-xs text-zinc-400">{themeColor}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={handleSave}
                            className="px-8 py-2 bg-white text-black text-lg font-bold rounded-full shadow-md hover:bg-zinc-100 transition"
                        >
                            Save
                        </Button>
                    </div>
                    <div className="mt-4 text-xs text-zinc-400 font-medium">
                        By proceeding, you agree to give Spotify access to the image you choose to upload.
                        <br />
                        Please make sure you have the right to upload the image.
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditPlaylist;
