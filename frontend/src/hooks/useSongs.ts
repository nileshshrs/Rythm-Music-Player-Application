import { useQuery } from "@tanstack/react-query";
import { getAllSongs } from "@/api/api";
import { getSongsByID } from "@/api/api";

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
