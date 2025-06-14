import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadAudio } from "@/hooks/useAudio";
import { useUploadImage } from "@/hooks/useImage";
import type { Song } from "@/utils/types";
import { useCreateSong, useEditSong, useSongs } from "@/hooks/useSongs";
import { useAlbums } from "@/hooks/useAlbums";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const getSongSchema = (isEditing: boolean) =>
    z.object({
        title: z.string().min(1, "Title is required"),
        artist: z.string().min(1, "Artist is required"),
        duration: z
            .number({ invalid_type_error: "Duration must be a number" })
            .min(1, "Duration must be greater than 0"),
        album: z.string().optional(),
        audioUrl: z.string().min(1, "Audio must be uploaded first!"),
        songImage: z.any().optional(),
        artistImage: z.any().optional(),
    });

type SongFormValues = z.infer<ReturnType<typeof getSongSchema>>;

type SongDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultValues?: Partial<SongFormValues> & { _id?: string }; // ADDED _id for edit
};

const SongDialog = ({ open, onOpenChange, defaultValues = {} }: SongDialogProps) => {
    const isEditing = !!defaultValues._id; // FIXED: use _id for edit detection

    const songImageRef = useRef<HTMLInputElement | null>(null);
    const artistImageRef = useRef<HTMLInputElement | null>(null);

    const [songImagePreview, setSongImagePreview] = useState<string | null>(null);
    const [artistImagePreview, setArtistImagePreview] = useState<string | null>(null);

    const [songImageUploaded, setSongImageUploaded] = useState(false);
    const [artistImageUploaded, setArtistImageUploaded] = useState(false);

    // Fetch albums (for select)
    const { albums = [] } = useAlbums();

    const schema = getSongSchema(isEditing);

    // Default album value as string
    const defaultAlbumId =
        defaultValues.album && albums.some(a => a._id === defaultValues.album)
            ? defaultValues.album
            : "no-album";

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<SongFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            artist: "",
            album: defaultAlbumId,
            duration: 0,
            audioUrl: "",
            songImage: "",
            artistImage: "",
        },
    });

    const albumId = watch("album") ?? "no-album";

    useEffect(() => {
        if (!open) {
            reset({
                title: "",
                artist: "",
                album: "no-album",
                duration: 0,
                audioUrl: "",
                songImage: "",
                artistImage: "",
            });
            setSongImagePreview(null);
            setArtistImagePreview(null);
            setSongImageUploaded(false);
            setArtistImageUploaded(false);
        }
    }, [open, reset]);

    useEffect(() => {
        if (isEditing && defaultValues && open) {
            reset({
                title: defaultValues.title || "",
                artist: defaultValues.artist || "",
                album: defaultAlbumId,
                duration: defaultValues.duration || 0,
                audioUrl: defaultValues.audioUrl || "",
                songImage: defaultValues.songImage || "",
                artistImage: defaultValues.artistImage || "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValues, isEditing, open, albums.length]);

    useEffect(() => {
        if (defaultValues.songImage && typeof defaultValues.songImage === "string" && open) {
            setSongImagePreview(defaultValues.songImage);
            setSongImageUploaded(true);
        }
        if (defaultValues.artistImage && typeof defaultValues.artistImage === "string" && open) {
            setArtistImagePreview(defaultValues.artistImage);
            setArtistImageUploaded(true);
        }
    }, [defaultValues.songImage, defaultValues.artistImage, open]);

    const uploadAudio = useUploadAudio();
    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadAudio.mutate(file, {
                onSuccess: (response) => {
                    const audioUrl = response?.audioUrl ?? response?.data?.audioUrl ?? "";
                    const duration = response?.duration ?? response?.data?.duration ?? 0;
                    setValue("audioUrl", audioUrl, { shouldValidate: true });
                    setValue("duration", duration, { shouldValidate: true });
                },
                onError: () => {
                    setValue("audioUrl", "", { shouldValidate: true });
                    setValue("duration", 0, { shouldValidate: true });
                }
            });
        } else {
            setValue("audioUrl", "", { shouldValidate: true });
            setValue("duration", 0, { shouldValidate: true });
        }
    };
    const { refetch } = useSongs();

    const songImageUpload = useUploadImage();
    const artistImageUpload = useUploadImage();

    const handleSongImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setSongImagePreview(localUrl);

            songImageUpload.mutate(file, {
                onSuccess: (url) => {
                    setValue("songImage", url, { shouldValidate: true });
                    setSongImagePreview(url);
                    setSongImageUploaded(true);
                },
                onError: () => {
                    setValue("songImage", "", { shouldValidate: true });
                    setSongImagePreview(null);
                    setSongImageUploaded(false);
                },
            });
        } else {
            setValue("songImage", "", { shouldValidate: true });
            setSongImagePreview(null);
            setSongImageUploaded(false);
        }
    };

    const handleArtistImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setArtistImagePreview(localUrl);

            artistImageUpload.mutate(file, {
                onSuccess: (url) => {
                    setValue("artistImage", url, { shouldValidate: true });
                    setArtistImagePreview(url);
                    setArtistImageUploaded(true);
                },
                onError: () => {
                    setValue("artistImage", "", { shouldValidate: true });
                    setArtistImagePreview(null);
                    setArtistImageUploaded(false);
                },
            });
        } else {
            setValue("artistImage", "", { shouldValidate: true });
            setArtistImagePreview(null);
            setArtistImageUploaded(false);
        }
    };

    const createSongMutation = useCreateSong();
    const editSongMutation = useEditSong(); // ADDED

    // REPLACED onSubmit with edit support
    const onSubmit = (data: SongFormValues) => {
        const album = data.album === "no-album" ? null : data.album!;
        const songData: Song = {
            ...data,
            album,
        };

        if (isEditing && defaultValues._id) {
            const { _id, ...updateData } = songData;
            editSongMutation.mutate(
                {
                    id: defaultValues._id,
                    data: updateData,
                },
                {
                    onSuccess: () => {
                        refetch();
                        onOpenChange(false);
                    },
                }
            );
        } else {
            createSongMutation.mutate(songData, {
                onSuccess: () => {
                    refetch();
                    onOpenChange(false);
                },
            });
        }
    };

    const renderError = (field: any) =>
        typeof field?.message === "string" ? (
            <p className="text-xs text-red-500">{field.message}</p>
        ) : null;

    const inputClass =
        "bg-zinc-800 border-0 text-white outline-none ring-0 focus:outline-none focus:ring-0 w-full";

    const isUploading = uploadAudio.isPending;
    const isSongImageUploading = songImageUpload.isPending;
    const isArtistImageUploading = artistImageUpload.isPending;
    const audioUrl = watch("audioUrl");
    const title = watch("title");
    const artist = watch("artist");
    const duration = watch("duration");

    const tickIcon = (
        <Check className="text-green-500 bg-zinc-900 rounded-full w-5 h-5 ml-2" />
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0d0d0d] text-white max-w-md p-0 overflow-hidden">
                <ScrollArea className="max-h-[80vh]">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                                {isEditing ? "Edit Song" : "Add New Song"}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-sm">
                                {isEditing
                                    ? "Update the song details"
                                    : "Add a new song to your music library"}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Song Image Upload */}
                        <div
                            className="border border-dashed border-zinc-700 rounded-md py-6 px-4 flex flex-col items-center justify-center gap-2 text-sm text-zinc-400 cursor-pointer hover:border-zinc-500 relative"
                            onClick={() => songImageRef.current?.click()}
                        >
                            <div className="w-full flex items-center justify-between absolute top-2 left-0 px-4 z-10 pointer-events-none">
                                <span />
                                {songImageUploaded && tickIcon}
                            </div>
                            {songImagePreview ? (
                                <img
                                    src={songImagePreview}
                                    alt="Song Artwork"
                                    className="w-20 h-20 object-cover rounded mt-2"
                                />
                            ) : (
                                <>
                                    <UploadCloud className="w-6 h-6" />
                                    <span>Upload Song Artwork</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                {...register("songImage")}
                                ref={(e) => {
                                    songImageRef.current = e;
                                }}
                                onChange={handleSongImageChange}
                                className="hidden"
                            />
                            {isSongImageUploading && (
                                <p className="text-xs text-zinc-400">Uploading image...</p>
                            )}
                        </div>

                        {/* Artist Image Upload */}
                        <div
                            className="border border-dashed border-zinc-700 rounded-md py-6 px-4 flex flex-col items-center justify-center gap-2 text-sm text-zinc-400 cursor-pointer hover:border-zinc-500 relative"
                            onClick={() => artistImageRef.current?.click()}
                        >
                            <div className="w-full flex items-center justify-between absolute top-2 left-0 px-4 z-10 pointer-events-none">
                                <span />
                                {artistImageUploaded && tickIcon}
                            </div>
                            {artistImagePreview ? (
                                <img
                                    src={artistImagePreview}
                                    alt="Artist"
                                    className="w-20 h-20 object-cover rounded mt-2"
                                />
                            ) : (
                                <>
                                    <UploadCloud className="w-6 h-6" />
                                    <span>Upload Artist Image</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                {...register("artistImage")}
                                ref={(e) => {
                                    artistImageRef.current = e;
                                }}
                                onChange={handleArtistImageChange}
                                className="hidden"
                            />
                            {isArtistImageUploading && (
                                <p className="text-xs text-zinc-400">Uploading image...</p>
                            )}
                        </div>

                        {/* Audio File */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Audio File</Label>
                                {audioUrl && tickIcon}
                            </div>
                            <Input
                                type="file"
                                accept="audio/*"
                                className={`${inputClass} file:text-white`}
                                onChange={handleAudioChange}
                                disabled={isUploading}
                            />
                            {isUploading && (
                                <p className="text-xs text-zinc-400">Uploading audio...</p>
                            )}
                            {renderError(errors.audioUrl)}
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Title</Label>
                                {title && title.length > 0 && tickIcon}
                            </div>
                            <Input {...register("title")} className={inputClass} />
                            {renderError(errors.title)}
                        </div>

                        {/* Artist */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Artist</Label>
                                {artist && artist.length > 0 && tickIcon}
                            </div>
                            <Input {...register("artist")} className={inputClass} />
                            {renderError(errors.artist)}
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Duration (seconds)</Label>
                                {duration && duration > 0 && tickIcon}
                            </div>
                            <Input
                                type="number"
                                {...register("duration", { valueAsNumber: true })}
                                className={inputClass}
                            />
                            {renderError(errors.duration)}
                        </div>

                        {/* Album */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Album (Optional)</Label>
                                {albumId !== "no-album" && tickIcon}
                            </div>
                            <Select
                                value={albumId}
                                onValueChange={val => setValue("album", val, { shouldValidate: true })}
                            >
                                <SelectTrigger className={inputClass + " w-full"}>
                                    <SelectValue>
                                        {albumId === "no-album"
                                            ? "Select album"
                                            : albums.find(a => a._id === albumId)?.title || "Unknown album"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="no-album">No album</SelectItem>
                                    {albums
                                        .filter(a => !!a._id)
                                        .map(album =>
                                            <SelectItem value={album._id as string} key={album._id}>
                                                {album.title}
                                            </SelectItem>
                                        )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                                disabled={
                                    isUploading ||
                                    !audioUrl ||
                                    isSongImageUploading ||
                                    isArtistImageUploading
                                }
                            >
                                {isEditing ? "Save Changes" : "Create Song"}
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default SongDialog;
