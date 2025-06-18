import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

// Format time utility
const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

// Static mock data (original and not from any real source)
const users = [
  {
    _id: "u1",
    clerkId: "ck1",
    fullName: "Maya Patel",
    imageUrl: "https://randomuser.me/api/portraits/women/43.jpg",
    online: true,
  },
  {
    _id: "u2",
    clerkId: "ck2",
    fullName: "Dylan Lee",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    online: false,
  },
  {
    _id: "u3",
    clerkId: "ck3",
    fullName: "Sophie Turner",
    imageUrl: "https://randomuser.me/api/portraits/women/75.jpg",
    online: true,
  },
];

const currentUser = {
  id: "ck1",
  imageUrl: "https://randomuser.me/api/portraits/women/43.jpg",
  fullName: "Maya Patel",
};

// Let's say Maya is chatting with Dylan
const selectedUser = users[1];

// Static chat messages
const messages = [
  {
    _id: "m1",
    senderId: "ck2",
    content: "Hey Maya, are you coming to the meeting later?",
    createdAt: "2025-06-18T09:45:00Z",
  },
  {
    _id: "m2",
    senderId: "ck1",
    content: "Hi Dylan! Yes, I'll be there at 2pm.",
    createdAt: "2025-06-18T09:46:05Z",
  },
  {
    _id: "m3",
    senderId: "ck2",
    content: "Great! Don’t forget to bring the project files.",
    createdAt: "2025-06-18T09:47:12Z",
  },
  {
    _id: "m4",
    senderId: "ck1",
    content: "Already have them ready 😊",
    createdAt: "2025-06-18T09:48:30Z",
  },
];

// Main static chat page
const Chat = () => (
  <main className='h-[80vh] rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
    <div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]'>
      {/* Users List (sidebar) */}
      <div className='border-r border-zinc-800'>
        <div className='flex flex-col h-full'>
          <ScrollArea className='h-[calc(100vh-280px)]'>
            <div className='space-y-2 p-4'>
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 
                    rounded-lg cursor-pointer transition-colors
                    ${selectedUser.clerkId === user.clerkId
                      ? "bg-zinc-800"
                      : "hover:bg-zinc-800/50"
                    }`}
                >
                  <div className='relative'>
                    <Avatar className='size-8 md:size-12'>
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                      ${user.online ? "bg-green-500" : "bg-zinc-500"}`}
                    />
                  </div>
                  <div className='flex-1 min-w-0 lg:block hidden'>
                    <span className='font-medium truncate'>{user.fullName}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Chat area */}
      <div className='flex flex-col h-full'>
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className='p-4 border-b border-zinc-800'>
              <div className='flex items-center gap-3'>
                <Avatar>
                  <AvatarImage src={selectedUser.imageUrl} />
                  <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='font-medium'>{selectedUser.fullName}</h2>
                  <p className='text-sm text-zinc-400'>
                    {selectedUser.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className='h-[calc(100vh-340px)]'>
              <div className='p-4 space-y-4'>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-start gap-3 ${
                      message.senderId === currentUser.id ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className='size-8'>
                      <AvatarImage
                        src={
                          message.senderId === currentUser.id
                            ? currentUser.imageUrl
                            : selectedUser.imageUrl
                        }
                      />
                    </Avatar>

                    <div
                      className={`rounded-lg p-3 max-w-[70%]
                        ${message.senderId === currentUser.id
                          ? "bg-green-500"
                          : "bg-zinc-800"
                        }`}
                    >
                      <p className='text-sm'>{message.content}</p>
                      <span className='text-xs text-zinc-300 mt-1 block'>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message input (static) */}
            <div className='p-4 mt-auto border-t border-zinc-800'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Type a message'
                  className='bg-zinc-800 border-none'
                  disabled
                />
                <Button size={"icon"} disabled>
                  <Send className='size-4' />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center h-full space-y-6'>
            <img src='/spotify.png' alt='Spotify' className='size-16 animate-bounce' />
            <div className='text-center'>
              <h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
              <p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </main>
);

export default Chat;
