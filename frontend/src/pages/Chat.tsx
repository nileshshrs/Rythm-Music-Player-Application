import { Outlet, useParams, useLocation, Link } from "react-router-dom";
import { useConversations } from "@/hooks/useConversation";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationSkeleton from "@/components/skeletons/ConversationSkeleton";

// Right panel empty state component
const NoConversationSelected = () => (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <img
      src="/logo.png" // Update with your logo path
      alt="Logo"
      className="w-16 h-16 mb-7 animate-bounce"
      draggable={false}
    />
    <h2 className="text-xl font-bold text-zinc-100 mb-2">
      No conversation selected
    </h2>
    <p className="text-zinc-400 text-sm">
      Choose a friend to start chatting
    </p>
  </div>
);

const Chat = () => {
  const { data: conversations = [], isLoading } = useConversations();
  const { id: selectedConversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const location = useLocation();

  // 1. Loading: sidebar + skeleton
  if (isLoading) {
    return (
      <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
        <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
          <div className="border-r border-zinc-800">
            <div className="flex flex-col h-full">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <ConversationSkeleton />
              </ScrollArea>
            </div>
          </div>
          <div />
        </div>
      </main>
    );
  }

  // 2. No conversations at all: full-screen empty state
  if (!isLoading && conversations.length === 0) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-20 h-20 mb-8 animate-bounce"
          draggable={false}
        />
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">
          No conversation selected
        </h2>
        <p className="text-zinc-400 text-xs">
          Choose a friend to start chatting
        </p>
      </div>
    );
  }

  // 3. Conversations exist:
  // - If on /messages (no conversation selected): show sidebar + right panel empty state
  // - If conversation selected, show sidebar + <Outlet />
  const isMessageRoute = location.pathname === "/messages" || location.pathname === "/messages/";

  return (
    <main className="h-[80vh] rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        {/* Sidebar */}
        <div className="border-r border-zinc-800">
          <div className="flex flex-col h-full">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-1 p-4">
                {conversations.map((conversation: any) => {
                  const other = conversation.participants.find(
                    (p: any) => p._id !== user?._id
                  );
                  const otherUsername = other?.username ?? "Unknown";
                  return (
                    <Link
                      key={conversation._id}
                      to={`/messages/${conversation._id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150
            ${selectedConversationId === conversation._id
                          ? "bg-zinc-800"
                          : "hover:bg-zinc-900/50"
                        }
          `}
                    >
                      <Avatar className="size-8 md:size-12">
                        {other?.image && other.image.length > 0 ? (
                          <AvatarImage src={other.image[0]} />
                        ) : (
                          <AvatarFallback className="bg-pink-500 text-white font-bold uppercase">
                            {otherUsername[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0 lg:block hidden">
                        <span className="font-medium text-base text-zinc-100 truncate leading-snug">
                          {otherUsername}
                        </span>
                        <div className="text-xs text-zinc-400 truncate leading-tight font-normal">
                          {conversation.lastMessage || (
                            <span className="italic text-zinc-500">No messages yet</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>

          </div>
        </div>
        {/* Right panel */}
        {isMessageRoute ? (
          <NoConversationSelected />
        ) : (
          <Outlet />
        )}
      </div>
    </main>
  );
};

export default Chat;
