import { useMutation, useQuery } from "@tanstack/react-query";
import { createAlbum, deleteAlbum, editAlbum, getAlbumsByID, getAllAlbums } from "@/api/api";
import { Album, AlbumResponse } from "../utils/types.ts";

export const useAlbum = (id: string | undefined) => {
  const { data, error, isLoading, isError, refetch } = useQuery<AlbumResponse>({
    queryKey: ["album", id],
    queryFn: async () => {
      const response = await getAlbumsByID(id!);
      return response; // <-- unwrap Axios response
    },
    enabled: !!id,
  });

  return {
    album: data?.album,
    songs: data?.songs,
    data,
    error,
    isLoading,
    isError,
    refetch,
  };
};

export const useAlbums = () => {
  const { data, error, isLoading, isError, refetch } = useQuery<Album[]>({
    queryKey: ["albums"],
    queryFn: async () => {
      const response = await getAllAlbums();
      return response;
    },
  });

  return {
    albums: data,
    data,
    error,
    isLoading,
    isError,
    refetch,
  };
};


export const useCreateAlbum = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useMutation<any, any, Album>({
    mutationFn: createAlbum,
    ...options,
  });
};


// Edit Album Hook
export const useEditAlbum = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Album> }) =>
      editAlbum(id, data),
  });
};

// Delete Album Hook
export const useDeleteAlbum = () => {
  return useMutation({
    mutationFn: (id: string) => deleteAlbum(id),
  });
};