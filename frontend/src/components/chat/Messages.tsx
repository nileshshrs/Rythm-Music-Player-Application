import { useParams } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useConversationByID } from "@/hooks/useConversation";
import { useOnlineUserIds } from "@/context/SocketContext";

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const Messages = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { data: conversation, isLoading } = useConversationByID(id || "");
  const onlineUserIds = useOnlineUserIds();

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-full text-zinc-400">Loading...</div>;
  }

  if (!conversation || !currentUser) {
    return <div className="flex flex-col items-center justify-center h-full text-zinc-400">No conversation found.</div>;
  }

  // Find the other participant
  const other = conversation.participants.find(
    (p: any) => p._id !== currentUser._id
  );

  // Determine if "other" is online
  const isOtherOnline = other && onlineUserIds.includes(other._id);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Avatar className="size-8 md:size-12">
            <AvatarImage src={other?.image?.[0] || ""} />
            <AvatarFallback className="bg-pink-500 text-white font-bold uppercase">{other?.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
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
        <div className="p-4 space-y-4">
          {conversation.messages?.length ? (
            conversation.messages.map((message: any) => (
              <div
                key={message._id}
                className={`flex items-start gap-3 ${message.senderId === currentUser._id ? "flex-row-reverse" : ""
                  }`}
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src={
                      message.senderId === currentUser._id
                        ? currentUser.image?.[0]
                        : other?.image?.[0]
                    }
                  />
                </Avatar>
                <div
                  className={`rounded-lg p-3 max-w-[70%]
                    ${message.senderId === currentUser._id
                      ? "bg-green-500"
                      : "bg-zinc-800"
                    }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs text-zinc-300 mt-1 block">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-zinc-400 text-center mt-10">No messages yet.</div>
          )}
        </div>
      </ScrollArea>

      {/* Message input (static, example) */}
      <div className="p-4 mt-auto border-t border-zinc-800">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message"
            className="bg-zinc-800 border-none"
            disabled
          />
          <Button size={"icon"} disabled>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
