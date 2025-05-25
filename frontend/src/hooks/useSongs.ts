import { useQuery } from "@tanstack/react-query";
import { getAllSongs } from "@/api/api";

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
