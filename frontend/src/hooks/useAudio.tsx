// hooks/useUploadAudio.ts
import { uploadSong } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

// The returned data will have: { message, audioUrl, public_id, duration }
export function useUploadAudio(options = {}) {
    return useMutation({
        mutationFn: (audioFile: File) => uploadSong(audioFile),
        ...options,
    });
}
