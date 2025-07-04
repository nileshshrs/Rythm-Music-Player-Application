import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "conversations", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export const messageModel = mongoose.model("message", messageSchema);