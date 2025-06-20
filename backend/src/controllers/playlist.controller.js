import playlistModel from "../models/playlist.model.js";
import PlaylistModel from "../models/playlist.model.js";
import SongModel from "../models/songs.model.js";
import { generateNextPlaylistName } from "../service/playlist.service.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

export const createEmptyPlaylistController = catchErrors(
    async (req, res) => {
        const userID = req.userID;


        const name = await generateNextPlaylistName(userID);

        const playlist = await PlaylistModel.create({
            name,
            owner: userID,
            songs: []
        })

        return res.status(CREATED).json({
            message: "Playlist created successfully",
            playlist
        })
    }
)

export const getPlaylistsByUserController = catchErrors(
    async (req, res) => {
        const userID = req.userID;

        const playlists = await PlaylistModel.find({ owner: userID })
            .select("_id name coverImage songs owner")
            .populate("owner", "username", "user")
            .sort({ createdAt: 1 }) // Ascending: oldest to newest
            .lean();

        const minimalPlaylists = playlists.map((playlist) => ({
            _id: playlist._id,
            name: playlist.name,
            coverImage: playlist.coverImage,
            totalSongs: playlist.songs.length,
            username: playlist.owner.username
        }));

        return res.status(OK).json(minimalPlaylists);
    }
);


export const getPlaylistByIdController = catchErrors(
    async (req, res) => {
        const { id } = req.params;
        const userID = req.userID;

        const playlist = await PlaylistModel.findOne({
            _id: id,
            owner: userID,
        })
            .populate({
                path: "songs",
                select: "title artist duration audioUrl songImage",
            })
            .populate("owner", "username", "user")
            .lean();

        appAssert(playlist, NOT_FOUND, "Playlist not found");

        // Extract only the username to the top level
        const response = {
            ...playlist,
            username: playlist.owner.username,
        };
        delete response.owner;

        return res.status(OK).json(response);
    }
);


export const addSongToPlaylistController = catchErrors(
    async (req, res) => {
        const { id } = req.params;
        const userID = req.userID;
        const { songID } = req.body;

        const playlist = await PlaylistModel.findOne({
            _id: id,
            owner: userID,
        });

        appAssert(playlist, NOT_FOUND, "Playlist not found");

        if (!playlist.songs.includes(songID)) {
            playlist.songs.push(songID);
            await playlist.save();
        }

        return res.status(OK).json({
            message: "Song added to playlist successfully",
            playlist,
        });
    }
);

export const updatePlaylistController = catchErrors(
    async (req, res) => {
        const { id } = req.params;
        const userID = req.userID; // comes from authenticate middleware
        const { name, themeColor, coverImage, description } = req.body;

        const playlist = await PlaylistModel.findOne({
            _id: id,
            owner: userID, // ensures only the owner can update
        });

        appAssert(playlist, NOT_FOUND, "Playlist not found");

        if (name) playlist.name = name;
        if (themeColor) playlist.themeColor = themeColor;
        if (coverImage) playlist.coverImage = coverImage;
        if (description !== undefined) playlist.description = description;

        await playlist.save();

        return res.status(OK).json({
            message: "Playlist updated successfully",
            playlist,
        });
    }
);



export const createPlaylistFromAlbumController = catchErrors(async (req, res) => {
    const userID = req.userID;
    const { albumID } = req.body;

    appAssert(albumID, NOT_FOUND, "Album ID is required");

    const songs = await SongModel.find({ album: albumID }).select("_id").lean();
    appAssert(songs.length > 0, NOT_FOUND, "No songs found for this album");

    const songIds = songs.map(song => song._id);
    const name = await generateNextPlaylistName(userID);

    const playlist = await PlaylistModel.create({
        name,
        owner: userID,
        songs: songIds,
    });

    return res.status(CREATED).json({
        message: "Playlist created from album",
        playlist,
    });
});


export const deletePlaylistController = catchErrors(
    async (req, res) => {
        const { id } = req.params;
        const userID = req.userID;

        const deleted = await playlistModel.findOneAndDelete({
            _id: id,
            owner: userID,
        });

        appAssert(deleted, NOT_FOUND, "Playlist not found or not owned by user");

        return res.status(OK).json({
            message: "Playlist deleted successfully",
        });
    });


export const getPlaylistsByUserIDController = catchErrors(
    async (req, res) => {
        const userId = req.params.id;

        // Find all playlists where owner is userId
        const playlists = await PlaylistModel.find({ owner: userId })
            .select("_id name coverImage songs owner")
            .populate("owner", "username", "user")
            .lean();
        if (!playlists || playlists.length === 0) {
            return res.status(404).json({ message: "No playlists found for this user" });
        }

        const minimalPlaylists = playlists.map((playlist) => ({
            _id: playlist._id,
            name: playlist.name,
            coverImage: playlist.coverImage,
            totalSongs: playlist.songs.length,
            username: playlist.owner.username
        }));

        return res.status(200).json(minimalPlaylists);
    }
);
