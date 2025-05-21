import AlbumModel from "../models/album.model.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, OK } from "../utils/constants/http.js";


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