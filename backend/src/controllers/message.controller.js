import { messageModel } from "../models/message.model.js";
import { createMessage } from "../service/message.service.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, OK } from "../utils/constants/http.js";

export const createMessageController = catchErrors(
    async (req, res) => {
        const sender = req.userID; // gets the sender id from jwt access token verification
        const conversation = req.params.id // gets the conversation id from :/id in the api url
        const content = req.body

        const message = { sender, conversation, ...content };

        const createdMessage = await createMessage(message);
        const id = createdMessage._id;

        const newMessage = await messageModel.findById(id)
            .populate("sender", "username",)
            .populate("recipient", "username",);

        return res.status(CREATED).json({
            message: "message created successfully",
            newMessage,
        });

    }
);

export const getMessagesController = catchErrors(
    async (req, res) => {
        const conversation = req.params.id;

        const messages = await messageModel.find({ conversation })
            .populate("sender", "username",)
            .populate("recipient", "username",);

        return res.status(OK).json(messages);
    }
);