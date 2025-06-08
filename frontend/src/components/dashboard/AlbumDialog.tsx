import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";

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
    defaultValues?: Partial<AlbumFormValues>;
};

const AlbumDialog = ({ open, onOpenChange, defaultValues }: AlbumDialogProps) => {
    const coverImageRef = useRef<HTMLInputElement | null>(null);
    const artistImageRef = useRef<HTMLInputElement | null>(null);
    const hiddenDateRef = useRef<HTMLInputElement | null>(null);

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

    const releaseDateValue = watch("releaseDate");

    const onSubmit = (data: AlbumFormValues) => {
        console.log("Submitted album:", data);
    };

    const inputClass =
        "bg-zinc-800 border-0 text-white outline-none ring-0 focus:outline-none focus:ring-0";

    const renderError = (field: any) =>
        typeof field?.message === "string" ? (
            <p className="text-xs text-red-500">{field.message}</p>
        ) : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0d0d0d] text-white max-w-md p-0 overflow-hidden">
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
                        className="border border-dashed border-zinc-700 rounded-md py-6 px-4 flex flex-col items-center justify-center gap-2 text-sm text-zinc-400 cursor-pointer hover:border-zinc-500"
                        onClick={() => coverImageRef.current?.click()}
                    >
                        <UploadCloud className="w-6 h-6" />
                        <span>Upload Cover Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("coverImage")}
                            ref={(e) => {
                                coverImageRef.current = e;
                            }}
                            onChange={(e) => setValue("coverImage", e.target.files?.[0])}
                            className="hidden"
                        />
                    </div>

                    {/* Artist Image Upload */}
                    <div
                        className="border border-dashed border-zinc-700 rounded-md py-6 px-4 flex flex-col items-center justify-center gap-2 text-sm text-zinc-400 cursor-pointer hover:border-zinc-500"
                        onClick={() => artistImageRef.current?.click()}
                    >
                        <UploadCloud className="w-6 h-6" />
                        <span>Upload Artist Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("artistImage")}
                            ref={(e) => {
                                artistImageRef.current = e;
                            }}
                            onChange={(e) => setValue("artistImage", e.target.files?.[0])}
                            className="hidden"
                        />
                    </div>

                    {/* Album Title */}
                    <div className="space-y-2">
                        <Label>Album Title</Label>
                        <Input {...register("title")} className={inputClass} />
                        {renderError(errors.title)}
                    </div>

                    {/* Artist */}
                    <div className="space-y-2">
                        <Label>Artist</Label>
                        <Input {...register("artist")} className={inputClass} />
                        {renderError(errors.artist)}
                    </div>

                    {/* Genre */}
                    <div className="space-y-2">
                        <Label>Genre</Label>
                        <Input {...register("genre")} className={inputClass} />
                    </div>
                    {/* Theme Color */}
                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <Input
                            type="color"
                            {...register("themeColor")}
                            className="w-full h-10 rounded bg-zinc-800 border border-zinc-600"
                        />
                    </div>
                    {/* Release Date */}
                    <div className="space-y-2">
                        <Label>Release Date</Label>
                        <div className="relative w-full">
                            <Input
                                type="text"
                                readOnly
                                value={releaseDateValue || ""}
                                placeholder="yyyy-mm-dd"
                                className={`${inputClass} h-10 pr-10 cursor-pointer`}
                                onClick={() => hiddenDateRef.current?.showPicker()}
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                            <input
                                type="date"
                                ref={hiddenDateRef}
                                onChange={(e) => setValue("releaseDate", e.target.value)}
                                className="absolute opacity-0 pointer-events-none h-0 w-0"
                            />
                        </div>
                    </div>



                    <Button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                        {defaultValues?.title ? "Save Changes" : "Create Album"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AlbumDialog;
