import { getMessagesByConversationID, sendMessage } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            content,
            recipient,
        }: { conversationId: string; content: string; recipient: string }) =>
            sendMessage(conversationId, content, recipient),
        onSuccess: (_data, variables) => {
            // Invalidate the individual conversation
            queryClient.invalidateQueries({
                queryKey: ["conversation", variables.conversationId],
            });
            // Invalidate all conversations (sidebar/list refresh)
            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });
        },
    });
};




export const useMessagesByConversationID = (conversationId: string) => {
    const {user} = useAuth();
    return useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => getMessagesByConversationID(conversationId),
        enabled: !!conversationId && !!user,
    });
};
