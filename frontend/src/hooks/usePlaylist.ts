import { createEmptyPlaylist, createPlaylistFromAlbum, deletePlaylist, getPlayistsByUser, getPlaylistById } from "@/api/api";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useUserPlaylists = () => {
    const {
        data: playlists,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["userplaylists"],
        queryFn: getPlayistsByUser,
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