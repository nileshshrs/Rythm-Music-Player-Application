import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar
                    className="w-9 h-9 cursor-pointer shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-shadow duration-200 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.14)]"
                >
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-pink-500 text-white text-sm">A</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[180px] mt-2 bg-[#18181b] text-[15px] text-[#fefefe] font-semibold shadow-[0_4px_12px_rgba(255,255,255,0.05)] rounded-none p-0 border-0"
            >
                {/* Username */}
                <div className="px-3 py-2 select-none">Nilesh</div>

                {/* Account*/}
                <DropdownMenuItem
                    className="px-3 py-2 cursor-default focus:bg-transparent focus:text-[#fefefe]"
                >
                    Account
                </DropdownMenuItem>

                {/* Ultra-thin Separator */}
                <DropdownMenuSeparator className="h-px bg-white/5 my-[2px]" />

                {/* Log out */}
                <DropdownMenuItem
                    className="px-3 py-2 cursor-default focus:bg-transparent focus:text-[#fefefe]"
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
