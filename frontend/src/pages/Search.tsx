import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAlbums } from "@/hooks/useAlbums";
import { useSongs } from "@/hooks/useSongs";
import { formatDuration } from "@/utils/formatDuration";
import { Album, Song } from "@/utils/types";
import EmptyResult from "./EmptyResult";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase().trim() || "";

  const { albums = [] } = useAlbums();
  const { songs = [] } = useSongs();

  const [showAllSongs, setShowAllSongs] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);

  const filteredAlbums: Album[] = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query)
  );

  const filteredSongs: Song[] = songs.filter(
    (song: Song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
  );

  const visibleAlbums = showAllAlbums ? filteredAlbums : filteredAlbums.slice(0, 4);
  const visibleSongs = showAllSongs ? filteredSongs : filteredSongs.slice(0, 5);

  const noResults = query && filteredAlbums.length === 0 && filteredSongs.length === 0;

  return (
    <div className="h-[80vh] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md p-6 text-white overflow-y-auto">
      {noResults ? (
        <EmptyResult query={query} />
      ) : (
        <div className="space-y-16">
          {/* Songs Section */}
          {filteredSongs.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Songs</h2>
                <button
                  onClick={() => setShowAllSongs(!showAllSongs)}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  {showAllSongs ? "Show less" : "Show all"}
                </button>
              </div>

              <div className="space-y-2">
                {visibleSongs.map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center gap-4 px-3 py-2 hover:bg-zinc-800 rounded-md transition group"
                  >
                    <div className="relative w-12 h-12 shrink-0">
                      <img
                        src={song.songImage || "/placeholder-song.png"}
                        alt={song.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <button className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-[10px] h-[10px] text-black"
                        >
                          <path d="M5 3v18l15-9L5 3z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{song.title}</div>
                      <div className="text-sm text-zinc-400 truncate">{song.artist}</div>
                    </div>
                    <div className="text-sm text-zinc-400">{formatDuration(song.duration)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums Section */}
          {filteredAlbums.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Albums</h2>
                <button
                  onClick={() => setShowAllAlbums(!showAllAlbums)}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  {showAllAlbums ? "Show less" : "Show all"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {visibleAlbums.map((album) => (
                  <div
                    key={album._id}
                    className="bg-[#1c1c1e] hover:bg-[#18181b] rounded-lg p-4 cursor-pointer group relative"
                  >
                    <div className="relative">
                      <img
                        src={album.coverImage || "/placeholder-album.png"}
                        alt={album.title}
                        className="w-full aspect-square object-cover rounded-md mb-4"
                      />
                      <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-black"
                        >
                          <path d="M5 3v18l15-9L5 3z" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-white font-semibold text-sm truncate">{album.title}</h3>
                    <p className="text-zinc-400 text-xs truncate">{album.artist}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
