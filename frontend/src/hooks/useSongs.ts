import { useMutation, useQuery } from "@tanstack/react-query";
import { createSong, deleteSong, editSong, getAllSongs } from "@/api/api";
import { getSongsByID } from "@/api/api";
import { Song } from "@/utils/types";

export const useSongs = () => {
  const {
    data: songs,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["songs"],
    queryFn: getAllSongs,
  });

  return {
    songs,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useSongByID = (id: string) => {
  const {
    data: song,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["song", id],
    queryFn: () => getSongsByID(id),
    enabled: !!id, // only run query if id exists
  });

  return {
    song,
    isLoading,
    isError,
    error,
    refetch,
  };
};


export const useCreateSong = () => {
  return useMutation({
    mutationFn: (data: Song) => createSong(data),
  });
};

export const useEditSong = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Song> }) =>
      editSong(id, data),
  });
};

export const useDeleteSong = () => {
  return useMutation({
    mutationFn: (id: string) => deleteSong(id),
  });
};