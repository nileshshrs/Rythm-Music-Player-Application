import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useConversationByID } from "@/hooks/useConversation";
import { useOnlineUserIds, useSocket } from "@/context/SocketContext";
import { useMessagesByConversationID, useSendMessage } from "@/hooks/useMessage";
import Loader from "../Loader";
import { queryClient } from "@/main";

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const Messages = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { data: conversation, isLoading: isConvLoading } = useConversationByID(id || "");
  const { data: messages, isLoading: isMsgLoading } = useMessagesByConversationID(id || "");
  const onlineUserIds = useOnlineUserIds();
  const [messageText, setMessageText] = useState("");
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const socket = useSocket();

  // State to store all messages: REST + real-time
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // On load/update, merge base REST and real-time
  useEffect(() => {
    setAllMessages(messages || []);
  }, [messages, id]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;
    const handler = (data: any) => {
      // Only handle messages for this conversation
      if (data.conversationId !== id) return;
      // Only add if not already present
      setAllMessages((prev) => {
        if (prev.find((msg) => msg._id === data.message._id)) return prev;
        return [...prev, data.message];
      });
    };
    socket.on("receive-message", handler);
    return () => {
      socket.off("receive-message", handler);
    };
  }, [socket, id]);

  // Always scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: "end", behavior: "auto" });
    }
  }, [allMessages.length]);

  if (isConvLoading || isMsgLoading) return <Loader />;
  if (!conversation || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400">
        No conversation found.
      </div>
    );
  }

  // Find the other participant
  const other = conversation.participants.find(
    (p: any) => p._id !== currentUser._id
  );
  const isOtherOnline = other && onlineUserIds.includes(other._id);

  const handleSend = () => {
    if (!messageText.trim() || !other) return;
    sendMessage(
      {
        conversationId: conversation._id,
        content: messageText.trim(),
        recipient: other._id,
      },
      {
        onSuccess: (data, variables) => {
          setMessageText("");
          // Emit socket event **after** DB success
          if (socket && data?.newMessage) {
            socket.emit("send-message", {
              conversationId: conversation._id,
              message: data.newMessage,
            });
          }
          queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
          queryClient.invalidateQueries({ queryKey: ["conversation", variables.conversationId] });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Avatar className="size-8 md:size-12">
            <AvatarImage src={other?.image?.[0] || ""} />
            <AvatarFallback className="bg-pink-500 text-white font-bold uppercase">
              {other?.username?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{other?.username || "Unknown User"}</h2>
            <p className={`text-sm ${isOtherOnline ? "text-green-400" : "text-zinc-400"}`}>
              {isOtherOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="h-[calc(100vh-340px)]">
        <div className="flex flex-col gap-3 p-4">
          {allMessages?.length ? (
            allMessages.map((message: any) => {
              const isSelf = message.sender._id === currentUser._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isSelf ? "justify-end" : "justify-start"} items-start`}
                >
                  {!isSelf && (
                    <div className="flex flex-col items-center mr-2 min-w-[40px]">
                      <Avatar className="size-8 mb-1">
                        <AvatarImage src={other?.image?.[0] || ""} />
                        <AvatarFallback className="bg-pink-500 text-white font-bold uppercase">
                          {other?.username?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-zinc-400 select-none">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col items-start max-w-[70%]">
                    <div
                      className={`px-4 py-2 rounded-md
                        ${isSelf ? "bg-green-600 text-white" : "bg-zinc-800 text-zinc-100"}
                        break-words text-base
                      `}
                    >
                      {message.content}
                    </div>
                  </div>

                  {isSelf && (
                    <div className="flex flex-col items-center ml-2 min-w-[40px]">
                      <Avatar className="size-8 mb-1">
                        <AvatarImage src={currentUser.image?.[0] || ""} />
                        <AvatarFallback className="bg-pink-500 text-white font-bold uppercase">
                          {currentUser.username?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-zinc-400 select-none">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-zinc-400 text-center mt-10">
              No messages yet.
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 mt-auto border-t border-zinc-800">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message"
            className="bg-zinc-800 border-none"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending || !other}
          />
          <Button
            size={"icon"}
            onClick={handleSend}
            disabled={isSending || !messageText.trim() || !other}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
