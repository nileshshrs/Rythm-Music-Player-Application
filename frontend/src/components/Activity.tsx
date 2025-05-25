import { Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsersListSkeleton from "./skeletons/UserListSkeleton";

const Activity = () => {
    return (
        <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Users className="size-5 shrink-0" />
                    <h2 className="font-semibold">What they're listening</h2>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    <UsersListSkeleton />
                </div>
            </ScrollArea>
        </div>
    );
};

export default Activity;
