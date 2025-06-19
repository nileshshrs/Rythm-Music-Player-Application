import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/api"; // or your correct API path

export const useUserById = (id: string, options = {}) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserById(id),
        ...options,
        enabled: !!id && (options as any).enabled !== false, // do not run if id is empty
    });
};
