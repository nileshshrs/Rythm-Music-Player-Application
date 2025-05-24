import SongModel from "../models/songs.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

export const createSongController = catchErrors(
    async (req, res) => {
        const request = req.body;

        const song = await SongModel.create({
            title: request.title,
            album: request.album || null, // Optional: song can be standalone
            artist: request.artist,
            artistImage: request.artistImage || "",
            songImage: request.songImage || "",
            audioUrl: request.audioUrl,
            duration: request.duration || 0, // Optional: default to 0 if not provided
        });

        return res.status(CREATED).json({
            message: "Song created successfully",
            song,
        });
    }
);

export const getAllSongsController = catchErrors(
    async (req, res) => {
        const songs = await SongModel.find().lean();
        return res.status(OK).json(songs);
    }
);


export const getSongsByIDController = catchErrors(
    async (req, res) => {
        const { id } = req.params;

        const song = await SongModel.findById(id).lean();
        appAssert(song, NOT_FOUND, "Song not found")

        return res.status(OK).json(song);
    }
)