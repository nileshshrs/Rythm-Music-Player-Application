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
    const songs = await SongModel.find()
      .populate({
        path: "album",
        select: "title",
        match: { _id: { $exists: true } } // ensures album exists
      })
      .lean();

    const response = songs.map(song => ({
      ...song,
      album: song.album?._id?.toString() || null,
      albumTitle: song.album?.title || null
    }));

    return res.status(OK).json(response);
  }
);

export const getSongsByIDController = catchErrors(
  async (req, res) => {
    const { id } = req.params;

    const song = await SongModel.findById(id)
      .populate({
        path: "album",
        select: "title themeColor", // Include themeColor
        match: { _id: { $exists: true } }
      })
      .lean();

    appAssert(song, NOT_FOUND, "Song not found");

    const response = {
      ...song,
      album: song.album?._id?.toString() || null,
      albumTitle: song.album?.title || null,
      themeColor: song.album?.themeColor || null,
    };

    return res.status(OK).json(response);
  }
);


export const editSongController = catchErrors(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const song = await SongModel.findById(id);
  appAssert(song, NOT_FOUND, "Song not found");

  // Only update provided fields
  if (updateData.title !== undefined) song.title = updateData.title;
  if (updateData.album !== undefined) song.album = updateData.album || null;
  if (updateData.artist !== undefined) song.artist = updateData.artist;
  if (updateData.artistImage !== undefined) song.artistImage = updateData.artistImage;
  if (updateData.songImage !== undefined) song.songImage = updateData.songImage;
  if (updateData.audioUrl !== undefined) song.audioUrl = updateData.audioUrl;
  if (updateData.duration !== undefined) song.duration = updateData.duration;

  await song.save();

  return res.status(OK).json({
    message: "Song updated successfully",
    song,
  });
});

export const deleteSongController = catchErrors(async (req, res) => {
  const { id } = req.params;

  const song = await SongModel.findById(id);
  appAssert(song, NOT_FOUND, "Song not found");

  await song.deleteOne();

  return res.status(OK).json({
    message: "Song deleted successfully",
    song, // Optionally include deleted song info
  });
});
