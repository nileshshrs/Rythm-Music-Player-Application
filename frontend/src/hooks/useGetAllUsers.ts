import { useQuery } from "@tanstack/react-query";
import { User } from "@/utils/types"; // adjust path if needed
import { getAllUsers } from "@/api/api";
import { useAuth } from "@/context/AuthContext";

export const useGetAllUsers = () => {
    const { user } = useAuth()
    return useQuery<User[], Error>({
        queryKey: ["users", "all"],
        queryFn: getAllUsers,
        enabled: !!user
    });
};
