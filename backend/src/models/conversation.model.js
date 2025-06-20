import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
    // messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    lastMessage: { type: String, default: '' },
    read: { type: String, default: null },

}, { timestamps: true })

conversationSchema.pre('save', function (next) {
    if (this.isModified('lastMessage')) {
        this.updatedAt = Date.now();
    }
    next();
});

export const conversationModel = mongoose.model("conversation", conversationSchema)