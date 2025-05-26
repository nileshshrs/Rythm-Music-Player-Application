import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
        className="w-[220px] mt-2 bg-[#18181b] text-sm text-[#fefefe] font-semibold rounded-md p-1 border-0 shadow-[0_2px_8px_rgba(255,255,255,0.03)]"
      >
        <div className="px-3 py-2 text-[14px] select-none">
          Nilesh
        </div>

        <DropdownMenuItem
          className="px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors hover:bg-zinc-800/40"
        >
          Account
        </DropdownMenuItem>
        <DropdownMenuItem
          className="px-3 py-2 text-[13px] cursor-pointer rounded-md transition-colors hover:bg-zinc-800/40"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
