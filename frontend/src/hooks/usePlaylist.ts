import { addSongToPlaylist, createEmptyPlaylist, createPlaylistFromAlbum, deletePlaylist, getPlayistsByUser, getPlaylistById, getPlaylistsByUserId, updatePlaylist } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { queryClient } from "@/main";
import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useUserPlaylists = () => {
    const { user } = useAuth()
    const {
        data: playlists,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["userplaylists"],
        queryFn: getPlayistsByUser,
        enabled: !!user
    });

    return {
        playlists,
        isLoading,
        isError,
        error,
        refetch,
    };
};



export const useCreatePlaylist = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: createEmptyPlaylist,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["userplaylists"] });
            const playlistId = data?.playlist?._id;
            if (playlistId) {
                navigate(`/playlist/${playlistId}`);
            }
        },
    });
};


export const useCreatePlaylistFromAlbum = (albumID?: string) => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => {
            if (!albumID) {
                return Promise.reject(new Error("Album ID is missing"));
            }
            return createPlaylistFromAlbum(albumID);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["userplaylists"] });
            const playlistId = data?.playlist?._id;
            if (playlistId) navigate(`/playlist/${playlistId}`);
        },
    });
};

export const usePlaylistById = (id?: string) => {
    return useQuery({
        queryKey: ["playlist", id],
        queryFn: () => {
            if (!id) throw new Error("Playlist ID is required");
            return getPlaylistById(id);
        },
        enabled: !!id, // only run query if id exists
    });
};

export const useDeletePlaylist = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (playlistId: string) => deletePlaylist(playlistId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userplaylists"] });
            navigate("/"); // go to homepage after deletion
        },
    });
};

export const useUpdatePlaylist = () => {
    return useMutation({
        mutationFn: ({
            playlistId,
            data,
        }: {
            playlistId: string;
            data: {
                name?: string;
                themeColor?: string;
                coverImage?: string;
                description?: string;
            };
        }) => updatePlaylist(playlistId, data),
        onSuccess: (_data, variables) => {
            // Invalidate both user playlists and the specific playlist
            queryClient.invalidateQueries({ queryKey: ["userplaylists"] });
            queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
        },
    });
};


export const useAddSongToPlaylist = (
    options?: UseMutationOptions<any, unknown, { playlistId: string; songId: string }>
) =>
    useMutation({
        mutationFn: ({
            playlistId,
            songId,
        }: {
            playlistId: string;
            songId: string;
        }) => addSongToPlaylist(playlistId, songId),
        onSuccess: (_data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ["userplaylists"] });
            queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
            // Call user-supplied onSuccess if present
            options?.onSuccess?.(_data, variables, context);
        },
        onError: (error, variables, context) => {
            options?.onError?.(error, variables, context);
        },
        ...options,
    });

export const usePlaylistsByUserId = (id?: string) => {
     const { user } = useAuth()
    return useQuery({
        queryKey: ["playlistsByUserId", id],
        queryFn: () => {
            if (!id) throw new Error("User ID is required");
            return getPlaylistsByUserId(id);
        },
        enabled: !!id && !!user,
    });
};