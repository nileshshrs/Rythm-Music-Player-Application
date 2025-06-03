import { getPlayistsByUser } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

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
