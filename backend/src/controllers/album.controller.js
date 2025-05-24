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
        const albums = await AlbumModel.find().sort({ createdAt: -1 }).lean();
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