import { useQuery } from "@tanstack/react-query";
import { getAlbumsByID } from "@/api/api";
import { AlbumResponse } from "../utils/types.ts";

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
