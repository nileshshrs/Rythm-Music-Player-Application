import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsersListSkeleton from "./skeletons/UserListSkeleton";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useOnlineUserIds, useUserActivityMap } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { MouseEvent, useState } from "react";
import { useCreateConversation } from "@/hooks/useConversation";

// Import the hook

const Activity = () => {
    const { data: users, isLoading } = useGetAllUsers();
    const onlineUserIds = useOnlineUserIds();
    const userActivityMap = useUserActivityMap();
    const { user: currentUser } = useAuth();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Use the mutation hook
    const createConversationMutation = useCreateConversation({
        onSuccess: (data:any) => {
            console.log("Conversation created successfully", data);
            setOpenDropdownId(null);
        },
        onError: (error:any) => {
            console.error("Failed to create conversation:", error);
        },
    });

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>, userId: string) => {
        e.preventDefault();
        setOpenDropdownId(userId);
    };

    const handleClose = () => setOpenDropdownId(null);

    const handleSendMessage = (userId: string) => {
        if (!currentUser) return;
        // Call mutation with both user ids as participants
        createConversationMutation.mutate([currentUser._id, userId]);
    };

    return (
        <div className="h-[88vh] bg-zinc-900 rounded-lg flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Users className="size-5 shrink-0" />
                    <h2 className="font-semibold">What they're listening</h2>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {isLoading && <UsersListSkeleton />}
                    {users && users.length === 0 && (
                        <div className="text-zinc-500">No users found.</div>
                    )}
                    {users &&
                        users.length > 0 &&
                        users
                            .filter((user) => user._id !== currentUser?._id)
                            .map((user) => {
                                const isOnline = onlineUserIds.includes(user._id);
                                const activity = userActivityMap[user._id];

                                return (
                                    <DropdownMenu
                                        key={user._id}
                                        open={openDropdownId === user._id}
                                        onOpenChange={(open) => {
                                            if (!open) handleClose();
                                        }}
                                    >
                                        <DropdownMenuTrigger asChild>
                                            <div
                                                onContextMenu={(e) => handleContextMenu(e, user._id)}
                                                className="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-zinc-800"
                                            >
                                                <div className="relative">
                                                    <Avatar className="w-9 h-9 cursor-pointer shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-shadow duration-200 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.14)]">
                                                        <AvatarImage src="" alt="User" />
                                                        <AvatarFallback className="bg-pink-500 text-white text-sm uppercase font-bold">
                                                            {user.username[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span
                                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-zinc-900 ${isOnline ? "bg-green-500" : "bg-zinc-500"
                                                            }`}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.username}</span>
                                                    <span className="text-xs text-zinc-400">
                                                        {!isOnline
                                                            ? "Offline"
                                                            : activity && activity.songTitle
                                                                ? `Listening to "${activity.songTitle}"`
                                                                : "Idle"}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            align="end"
                                            sideOffset={-50}
                                            className="w-[220px] mt-2 bg-[#18181b] text-sm text-[#fefefe] font-semibold rounded-md p-0 border border-white/10 shadow-[0_2px_8px_rgba(255,255,255,0.03)]"
                                        >
                                            <DropdownMenuItem className="px-3 py-2 hover:bg-zinc-800 focus:bg-zinc-800 transition-colors">
                                                <Link
                                                    to={`/profile/${user._id}`}
                                                    className="w-full hover:text-white transition-colors"
                                                >
                                                    View Profile
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onSelect={() => handleSendMessage(user._id)}
                                                className="px-3 py-2 hover:bg-zinc-800 focus:bg-zinc-800 transition-colors hover:!text-white"
                                            >
                                                Send Message
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                );
                            })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default Activity;
