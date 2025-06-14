import AlbumModel from "../models/album.model.js";
import SongModel from "../models/songs.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";


export const createAlbumController = catchErrors(
    async (req, res) => {
        const request = req.body;

        const album = await AlbumModel.create({
            title: request.title,
            artist: request.artist,
            artistImage: request.artistImage || "",
            coverImage: request.coverImage || "",
            genre: request.genre || "",
            themeColor: request.themeColor || "#000000",
            releaseDate: request.releaseDate, // will be undefined if not sent — totally fine
        });

        return res.status(CREATED).json({
            message: "Album created successfully",
            album,
        });
    }
);

export const getAllAlbumsController = catchErrors(
    async (req, res) => {
        const albums = await AlbumModel.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "songs", // must match your songs collection name
                    localField: "_id",
                    foreignField: "album",
                    as: "songs"
                }
            },
            {
                $addFields: {
                    totalSongs: { $size: "$songs" }
                }
            },
            {
                $project: {
                    songs: 0 // remove songs array from output
                }
            }
        ]);
        return res.status(OK).json(albums);
    }
);


export const getAlbumByIDController = catchErrors(
    async (req, res) => {
        const { id } = req.params;

        const album = await AlbumModel.findById(id).lean();

        appAssert(album, NOT_FOUND, "Album not found");

        const songs = await SongModel.find({ album: id }).lean();

        return res.status(OK).json({
            album,
            songs
        });
    }
)

export const deleteAlbumController = catchErrors(
    async (req, res) => {
        const { id } = req.params;

        // Delete the album
        const album = await AlbumModel.findByIdAndDelete(id).lean();
        appAssert(album, NOT_FOUND, "Album not found");

        // Unlink songs by setting their album field to null
        await SongModel.updateMany(
            { album: id },
            { $set: { album: null } }
        );

        return res.status(OK).json({
            message: "Album deleted successfully and all related songs unlinked.",
            album,
        });
    }
);

// Edit Album Controller (PATCH /album/update/:id)
export const editAlbumController = catchErrors(
    async (req, res) => {
        const { id } = req.params;
        const updates = req.body;

        // Find and update
        const album = await AlbumModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    title: updates.title,
                    artist: updates.artist,
                    artistImage: updates.artistImage || "",
                    coverImage: updates.coverImage || "",
                    genre: updates.genre || "",
                    themeColor: updates.themeColor || "#000000",
                    releaseDate: updates.releaseDate,
                }
            },
            { new: true, lean: true }
        );

        appAssert(album, NOT_FOUND, "Album not found");

        return res.status(OK).json({
            message: "Album updated successfully",
            album,
        });
    }
);
