import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { User } from "@/utils/types";
import { getCurrentUser } from "@/api/api";

// Define type aliases to simplify generics
type QueryData = User;
type ErrorType = Error;

export const useGetUser = (
  options?: Omit<UseQueryOptions<QueryData, ErrorType, QueryData, readonly string[]>, "queryKey" | "queryFn">
) => {
  return useQuery<QueryData, ErrorType, QueryData, readonly string[]>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    ...options,
  });
};
