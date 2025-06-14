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
import { UploadCloud, Check, Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadImage } from "@/hooks/useImage";
import { useAlbums, useCreateAlbum, useEditAlbum } from "@/hooks/useAlbums";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const albumSchema = z.object({
    title: z.string().min(1, "Title is required"),
    artist: z.string().min(1, "Artist is required"),
    genre: z.string().optional(),
    releaseDate: z.string().optional(),
    themeColor: z.string().optional(),
    coverImage: z.any().optional(),
    artistImage: z.any().optional(),
});

type AlbumFormValues = z.infer<typeof albumSchema>;

type AlbumDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultValues?: Partial<AlbumFormValues> & { _id?: string };
};

const AlbumDialog = ({
    open,
    onOpenChange,
    defaultValues,
}: AlbumDialogProps) => {
    const coverImageRef = useRef<HTMLInputElement | null>(null);
    const artistImageRef = useRef<HTMLInputElement | null>(null);
    const { refetch } = useAlbums()

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [artistImagePreview, setArtistImagePreview] = useState<string | null>(null);
    const [coverImageUploaded, setCoverImageUploaded] = useState(false);
    const [artistImageUploaded, setArtistImageUploaded] = useState(false);

    const coverImageUpload = useUploadImage();
    const artistImageUpload = useUploadImage();

    const createAlbumMutation = useCreateAlbum({
        onSuccess: (res) => {
            console.log("Album created successfully:", res);
            refetch()
            onOpenChange(false);
        },
        onError: (error) => {
            console.error("Failed to create album:", error);
        },
    });

    const editAlbumMutation = useEditAlbum();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AlbumFormValues>({
        resolver: zodResolver(albumSchema),
        defaultValues: {
            title: "",
            artist: "",
            genre: "",
            releaseDate: "",
            themeColor: "#000000",
        },
    });

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                title: "",
                artist: "",
                genre: "",
                releaseDate: "",
                themeColor: "#000000",
                coverImage: "",
                artistImage: "",
            });
            setCoverImagePreview(null);
            setArtistImagePreview(null);
            setCoverImageUploaded(false);
            setArtistImageUploaded(false);
        }
    }, [open, reset]);

    useEffect(() => {
        if (defaultValues?.coverImage && typeof defaultValues.coverImage === "string" && open) {
            setCoverImagePreview(defaultValues.coverImage);
            setCoverImageUploaded(true);
        }
        if (defaultValues?.artistImage && typeof defaultValues.artistImage === "string" && open) {
            setArtistImagePreview(defaultValues.artistImage);
            setArtistImageUploaded(true);
        }
    }, [defaultValues?.coverImage, defaultValues?.artistImage, open]);

    const releaseDateValueRaw = watch("releaseDate");
    const releaseDateValue = releaseDateValueRaw
        ? releaseDateValueRaw.slice(0, 10)
        : "";

    const title = watch("title");
    const artist = watch("artist");
    const genre = watch("genre");
    const themeColor = watch("themeColor");

    const tickIcon = (
        <Check className="text-green-500 bg-zinc-900 rounded-full w-5 h-5 ml-2" />
    );

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setCoverImagePreview(localUrl);
            coverImageUpload.mutate(file, {
                onSuccess: (url) => {
                    setValue("coverImage", url, { shouldValidate: true });
                    setCoverImagePreview(url);
                    setCoverImageUploaded(true);
                },
                onError: () => {
                    setValue("coverImage", "", { shouldValidate: true });
                    setCoverImagePreview(null);
                    setCoverImageUploaded(false);
                },
            });
        } else {
            setValue("coverImage", "", { shouldValidate: true });
            setCoverImagePreview(null);
            setCoverImageUploaded(false);
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

    const [calendarOpen, setCalendarOpen] = useState(false);

    const onSubmit = (data: AlbumFormValues) => {
        const payload = {
            ...data,
            coverImage: typeof data.coverImage === "string" ? data.coverImage : "",
            artistImage: typeof data.artistImage === "string" ? data.artistImage : "",
            themeColor: data.themeColor || "#000000",
        };
        if (defaultValues && defaultValues._id) {
            // Edit album
            editAlbumMutation.mutate(
                { id: defaultValues._id, data: payload },
                {
                    onSuccess: (res) => {
                        console.log("Album edited successfully:", res);
                        refetch()
                        onOpenChange(false);

                    },
                    onError: (error) => {
                        console.error("Failed to edit album:", error);
                    },
                }
            );
        } else {
            // Add album
            createAlbumMutation.mutate(payload);
        }
    };

    const inputClass =
        "bg-zinc-800 border-0 text-white outline-none ring-0 focus:outline-none focus:ring-0 hover:text-white";

    const renderError = (field: any) =>
        typeof field?.message === "string" ? (
            <p className="text-xs text-red-500">{field.message}</p>
        ) : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0d0d0d] text-white max-w-md p-0 overflow-hidden">
                <ScrollArea className="max-h-[80vh]">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                                {defaultValues?.title ? "Edit Album" : "Add New Album"}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-sm">
                                {defaultValues?.title
                                    ? "Update the album details"
                                    : "Add a new album to your music library"}
                            </DialogDescription>
                        </DialogHeader>
                        {/* Cover Image Upload */}
                        <div
                            className="border border-dashed border-zinc-700 rounded-md py-6 px-4 flex flex-col items-center justify-center gap-2 text-sm text-zinc-400 cursor-pointer hover:border-zinc-500 relative"
                            onClick={() => coverImageRef.current?.click()}
                        >
                            <div className="w-full flex items-center justify-between absolute top-2 left-0 px-4 z-10 pointer-events-none">
                                <span />
                                {coverImageUploaded && tickIcon}
                            </div>
                            {coverImagePreview ? (
                                <img
                                    src={coverImagePreview}
                                    alt="Album Cover"
                                    className="w-20 h-20 object-cover rounded mt-2"
                                />
                            ) : (
                                <>
                                    <UploadCloud className="w-6 h-6" />
                                    <span>Upload Cover Image</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                {...register("coverImage")}
                                ref={(e) => {
                                    coverImageRef.current = e;
                                }}
                                onChange={handleCoverImageChange}
                                className="hidden"
                            />
                            {coverImageUpload.isPending && (
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
                            {artistImageUpload.isPending && (
                                <p className="text-xs text-zinc-400">Uploading image...</p>
                            )}
                        </div>
                        {/* Album Title */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Album Title</Label>
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
                        {/* Genre */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Genre</Label>
                                {genre && genre.length > 0 && tickIcon}
                            </div>
                            <Input {...register("genre")} className={inputClass} />
                        </div>
                        {/* Theme Color */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Theme Color</Label>
                                {themeColor && tickIcon}
                            </div>
                            <Input
                                type="color"
                                {...register("themeColor")}
                                className="w-full h-10 rounded bg-zinc-800 border border-zinc-600"
                            />
                        </div>
                        {/* Release Date */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Release Date</Label>
                                {releaseDateValue && tickIcon}
                            </div>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal 
                                            bg-zinc-800 border-0 text-white h-10 pr-10 cursor-pointer 
                                            shadow-none hover:bg-zinc-800 hover:text-white 
                                            focus:bg-zinc-800 focus:text-white focus:outline-none focus:ring-0
                                            active:bg-zinc-800 active:text-white`}
                                        style={{ color: "white" }}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 text-white" />
                                        {releaseDateValue
                                            ? format(new Date(releaseDateValue), "yyyy-MM-dd")
                                            : <span className="text-zinc-400">Pick a date</span>
                                        }
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-[#18181b] text-white border-zinc-700">
                                    <Calendar
                                        mode="single"
                                        selected={releaseDateValue ? new Date(releaseDateValue) : undefined}
                                        onSelect={date => {
                                            setValue(
                                                "releaseDate",
                                                date ? date.toISOString().slice(0, 10) : ""
                                            );
                                            setCalendarOpen(false);
                                        }}
                                        initialFocus
                                        className="bg-[#18181b] text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                            disabled={createAlbumMutation.isPending || editAlbumMutation.isPending}
                        >
                            {defaultValues?.title ? "Save Changes" : "Create Album"}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AlbumDialog;
