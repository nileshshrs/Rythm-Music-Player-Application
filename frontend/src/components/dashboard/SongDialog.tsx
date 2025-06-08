import { useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const getSongSchema = (isEditing: boolean) =>
    z.object({
        title: z.string().min(1, "Title is required"),
        artist: z.string().min(1, "Artist is required"),
        duration: z
            .number({ invalid_type_error: "Duration must be a number" })
            .min(1, "Duration must be greater than 0"),
        album: z.string().optional(),
        audioUrl: isEditing
            ? z.any().optional()
            : z
                .any()
                .refine((file) => file instanceof File, "Audio file is required"),
        songImage: z.any().optional(),
        artistImage: z.any().optional(),
    });

type SongFormValues = z.infer<ReturnType<typeof getSongSchema>>;

type SongDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultValues?: Partial<SongFormValues>;
};

const SongDialog = ({ open, onOpenChange, defaultValues = {} }: SongDialogProps) => {
    const isEditing = !!defaultValues.title;

    const songImageRef = useRef<HTMLInputElement | null>(null);
    const artistImageRef = useRef<HTMLInputElement | null>(null);

    const schema = getSongSchema(isEditing);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<SongFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            artist: "",
            album: "",
            duration: 0,
        },
    });

    useEffect(() => {
        if (isEditing && defaultValues) {
            reset({
                title: defaultValues.title || "",
                artist: defaultValues.artist || "",
                album: defaultValues.album || "",
                duration: defaultValues.duration || 0,
            });
        }
    }, [defaultValues, reset, isEditing]);

    const onSubmit = (data: SongFormValues) => {
        console.log("Submitted:", data);
        // Handle submit here
    };

    const renderError = (field: any) =>
        typeof field?.message === "string" ? (
            <p className="text-xs text-red-500">{field.message}</p>
        ) : null;

    const inputClass = "bg-zinc-800 border-0 text-white outline-none ring-0 focus:outline-none focus:ring-0";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0d0d0d] text-white max-w-md p-0 overflow-hidden">
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
                        className="border border-dashed border-zinc-700 rounded-md py-6 px-4 flex flex-col items-center justify-center gap-2 text-sm text-zinc-400 cursor-pointer hover:border-zinc-500"
                        onClick={() => songImageRef.current?.click()}
                    >
                        <UploadCloud className="w-6 h-6" />
                        <span>Upload Song Artwork</span>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("songImage")}
                            ref={(e) => {
                                songImageRef.current = e;
                            }}
                            onChange={(e) => setValue("songImage", e.target.files?.[0])}
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

                    {/* Audio File */}
                    <div className="space-y-2">
                        <Label>Audio File</Label>
                        <Input
                            type="file"
                            accept="audio/*"
                            className={`${inputClass} file:text-white`}
                            {...register("audioUrl")}
                            onChange={(e) => setValue("audioUrl", e.target.files?.[0])}
                        />
                        {renderError(errors.audioUrl)}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...register("title")} className={inputClass} />
                        {renderError(errors.title)}
                    </div>

                    {/* Artist */}
                    <div className="space-y-2">
                        <Label>Artist</Label>
                        <Input {...register("artist")} className={inputClass} />
                        {renderError(errors.artist)}
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <Label>Duration (seconds)</Label>
                        <Input
                            type="number"
                            {...register("duration", { valueAsNumber: true })}
                            className={inputClass}
                        />
                        {renderError(errors.duration)}
                    </div>

                    {/* Album */}
                    <div className="space-y-2">
                        <Label>Album (Optional)</Label>
                        <Input {...register("album")} className={inputClass} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                        {isEditing ? "Save Changes" : "Create Song"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SongDialog;
