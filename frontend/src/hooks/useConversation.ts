import { createConversation, getAllConversations, getConversationByID } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";

type CreateConversationPayload = string[];

interface UseCreateConversationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useCreateConversation = (options?: UseCreateConversationOptions) => {
  return useMutation<any, any, CreateConversationPayload>({
    mutationFn: createConversation,
    ...options,
  });
};



export const useConversations = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getAllConversations,
    enabled: !!user
  });
};


export const useConversationByID = (id: string) => {
   const { user } = useAuth()
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConversationByID(id),
    enabled: !!id && !!user, // only run if id is not empty
  });
};
``