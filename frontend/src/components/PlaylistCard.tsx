import { useLocation, useParams } from "react-router-dom";
import { useUserPlaylists, usePlaylistsByUserId } from "@/hooks/usePlaylist";
import { Link } from "react-router-dom";

const PlaylistCard = () => {
    const location = useLocation();
    const params = useParams();

    // Determine which hook to use based on the path
    let playlists, isLoading, isError;
    if (location.pathname.startsWith("/profile/") && params.id) {
        // /profile/:id
        const query = usePlaylistsByUserId(params.id);
        playlists = query.data;
        isLoading = query.isLoading;
        isError = query.isError;
    } else {
        // /account or default
        const query = useUserPlaylists();
        playlists = query.playlists;
        isLoading = query.isLoading;
        isError = query.isError;
    }
    console.log("Playlists:", playlists, "Loading:", isLoading, "Error:", isError);

    return (
        <div className="pt-4 pb-2 px-6 md:px-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Your Playlists
            </h2>
            <div className="overflow-x-auto -mx-6 md:-mx-12 px-6 md:px-12">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                    {isLoading || isError || !playlists
                        ? null
                        : playlists.map((playlist: any) => (
                            <Link
                                key={playlist._id}
                                to={`/playlist/${playlist._id}`}
                                className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden group hover:bg-zinc-800 transition-colors w-[200px] p-4 block"
                            >
                                <div className="relative w-[172px] h-[172px] mx-auto">
                                    <img
                                        src={
                                            playlist.coverImage ||
                                            "/Note.jpg"
                                        }
                                        alt={playlist.name}
                                        className="w-full h-full object-cover rounded-md"
                                        draggable={false}
                                    />
                                </div>
                                <div className="px-0 pt-2 pb-0 flex flex-col gap-1">
                                    <h3 className="font-bold text-lg text-white break-words whitespace-normal">
                                        {playlist.name}
                                    </h3>
                                    <span className="text-zinc-400 text-sm break-words whitespace-normal">
                                        Playlist • {playlist.username}
                                    </span>
                                    <span className="text-zinc-400 text-xs font-medium mt-1 break-words whitespace-normal">
                                        {playlist.totalSongs} Song{playlist.totalSongs !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default PlaylistCard;
