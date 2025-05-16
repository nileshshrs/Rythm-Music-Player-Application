import { ScrollArea } from "@/components/ui/scroll-area";

const Album = () => {
    return (
        <div className="h-full">
            <ScrollArea className="h-full overflow-y-auto">
                <div className="relative min-h-full">
                    {/* Background gradient overlay */}
                    <div
                        className="absolute inset-0 
              bg-gradient-to-b from-[#5038aa]/80 
              via-zinc-900/80 to-zinc-900 
              pointer-events-none"
                    />

                    {/* Main content */}
                    <div className="relative z-10">
                        {/* Album Header (like Spotify) */}
                        <div className="flex items-end gap-6 px-6 pt-10 pb-8">
                            {/* Album cover */}
                            <img
                                src="https://i.scdn.co/image/ab67616d0000b27392d21aef6c0d288cc4c05973"
                                alt="Album Cover"
                                className="w-[240px] h-[240px] shadow-xl rounded"
                            />

                            {/* Album details */}
                            <div className="text-white space-y-4">
                                <p className="text-sm uppercase text-zinc-400 font-medium">Album</p>
                                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                                    Album Title
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <span className="text-white font-semibold">Artist Name</span>
                                    <span>&bull;</span>
                                    <span>2025</span>
                                    <span>&bull;</span>
                                    <span>15 songs</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Album;
