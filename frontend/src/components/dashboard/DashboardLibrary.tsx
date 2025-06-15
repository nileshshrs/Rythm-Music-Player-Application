import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import SongLibrary from "./SongLibrary";
import AlbumLibrary from "./AlbumLibrary";


const DashboardLibrary = () => {
    return (
        <div className="w-full mx-auto max-w-[1400px]">
            <Tabs defaultValue="songs" className="w-full">
                {/* Tabs Header */}
                <div className="flex items-center justify-start border-b border-zinc-700/60 mb-4">
                    <TabsList className="bg-transparent p-0 gap-2">
                        <TabsTrigger
                            value="songs"
                            className="mb-2 px-4 py-2 text-sm font-semibold text-zinc-400 rounded-md transition
        data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                        >
                            SONGS
                        </TabsTrigger>
                        <TabsTrigger
                            value="albums"
                            className="mb-2 px-4 py-2 text-sm font-semibold text-zinc-400 rounded-md transition
        data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                        >
                            ALBUMS
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* SONGS */}
                <TabsContent value="songs">
                    <SongLibrary />
                </TabsContent>

                {/* ALBUMS */}
                <TabsContent value="albums">
                    <AlbumLibrary />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardLibrary;
