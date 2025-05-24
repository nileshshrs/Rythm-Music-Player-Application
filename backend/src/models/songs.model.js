import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "album",
    default: null, // Optional: song can be standalone
  },
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  artistImage: {
    type: String,
    default: "", // URL to artist profile image for this song
    trim: true,
  },
  songImage: {
    type: String,
    default: "", // URL to cover art of the song
    trim: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in seconds
  },
}, { timestamps: true });

const SongModel = mongoose.model("song", songSchema);
export default SongModel;
