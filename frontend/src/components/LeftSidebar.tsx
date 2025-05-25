import { HomeIcon, Library, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import PlaylistSkeleton from "./skeletons/PlaylistSkeleton"

const LeftSidebar = () => {
    const isLoading = true

    //fetch data from the server
    return (
        <div className="h-[88vh] flex flex-col gap-2">
            {/* Navigation */}
            <div className="rounded-lg bg-zinc-900 p-4">
                <nav className="space-y-2">
                    <Link
                        to="/"
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                className: "w-full justify-start text-white hover:bg-zinc-800",
                            })
                        )}
                    >
                        <HomeIcon className="mr-2 size-5" />
                        <span className="hidden md:inline">Home</span>
                    </Link>

                    <Link
                        to="/messages"
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                className: "w-full justify-start text-white hover:bg-zinc-800",
                            })
                        )}
                    >
                        <MessageCircle className="mr-2 size-5" />
                        <span className="hidden md:inline">Messages</span>
                    </Link>
                </nav>
            </div>

            {/* Library */}
            <div className="flex-1 rounded-lg bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-white px-2">
                        <Library className="mr-2 size-5" />
                        <span className="hidden md:inline">Playlist</span>
                    </div>
                </div>
                <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto">
                    <div className="space-y-2">
                        {isLoading ? (
                            <PlaylistSkeleton />
                        ): (
                            "Some playlist data here" 
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default LeftSidebar
