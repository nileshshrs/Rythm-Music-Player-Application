import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        coverImage: {
            type: String,
            default: "https://t4.ftcdn.net/jpg/08/12/88/67/240_F_812886725_TVmFx7y2k6vGUaRyrVJhJ4umZiQEnQ3A.jpg",
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "song",
            },
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        themeColor: {
            type: String,
            default: "#5038aa", // store just the base color
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Playlist", playlistSchema);
