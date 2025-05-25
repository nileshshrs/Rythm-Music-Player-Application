import { LayoutDashboardIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserDropdown from "./UserDropdown";

const Topbar = () => {
    return (
        <div className="rounded-md mb-4 h-16 w-full flex items-center justify-between px-6 sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md">
            {/* Search Bar */}
            <div className="flex items-center bg-zinc-800 px-4 py-2 h-10 rounded-full max-w-[364px] w-full text-sm text-zinc-100">
                <Search className="w-4 h-4 text-zinc-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search for songs, artists, or albums"
                    className="bg-transparent outline-none w-full placeholder:text-zinc-400"
                />
            </div>

            {/* Right side: Admin Button + Avatar */}
            <div className="flex items-center gap-4">
                <Link
                    to="/admin"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-9 px-4 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors duration-150 hover:bg-zinc-700 hover:text-white"
                    )}
                >
                    <LayoutDashboardIcon className="size-4 mr-2" />
                    Dashboard
                </Link>

                <UserDropdown />
            </div>
        </div>
    );
};

export default Topbar;
