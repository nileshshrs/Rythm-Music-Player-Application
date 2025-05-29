import PlaylistModel from "../models/playlist.model.js";

export const generateNextPlaylistName = async (userID) => {

    const playlists = await PlaylistModel.find({
        owner: userID,
        name: /^Playlist \d+$/,
    }).select("name");

    const usedNumbers = playlists
        .map((p) => {
            const match = p.name.match(/^Playlist (\d+)$/);
            return match ? parseInt(match[1]) : null;
        }).filter((n) => n !== null)
        .sort((a, b) => a - b);

    let next = 1;

    for (const num of usedNumbers) {
        if (num === next) next++;
        else break;
    }

    return `Playlist ${next}`;

}

