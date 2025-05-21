import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: String,
        required: true,
        trim: true,
    },
    artistImage: {
        type: String,
        default: "",
        trim: true,
    },
    coverImage: {
        type: String,
        default: "",
        trim: true,
    },
    releaseDate: {
        type: Date,
    },
    genre: {
        type: String,
        trim: true,
    },
    themeColor: {
        type: String,
        default: "#000000",
        trim: true,
    },
}, { timestamps: true });

const AlbumModel = mongoose.model("album", albumSchema);
export default AlbumModel;
