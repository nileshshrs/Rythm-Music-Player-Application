import { conversationModel } from "../models/conversation.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";


export const createConversationController = catchErrors(async (req, res) => {
    let { participants } = req.body;

    if (!Array.isArray(participants) || participants.length === 0) {
        return res.status(400).json({ message: "participants array is required" });
    }

    // Sort participants array for consistent matching
    participants = participants.sort();

    // Try to find existing conversation with exact participants
    let conversation = await conversationModel.findOne({ participants });

    if (!conversation) {
        // Create new conversation if none found
        conversation = await conversationModel.create({ participants });
    }

    appAssert(conversation, NOT_FOUND, "Failed to create conversation.");

    return res.status(CREATED).json({
        message: "Conversation created successfully",
        conversation,
    });
});


export const getConversationController = catchErrors(async (req, res) => {
    const userID = req.userID;

    const conversation = await conversationModel
        .find({ participants: userID })
        .populate("participants", "username")
        .sort({ updatedAt: -1 });;

    appAssert(conversation, NOT_FOUND, "conversation not found.");

    return res.status(OK).json(conversation);
})

export const getConversationByIDController = catchErrors(async (req, res) => {
    const conversationID = req.params.id;


    const conversation = await conversationModel.findById({ _id: conversationID })
        .populate("participants", "username")
     


    appAssert(conversation, NOT_FOUND, `conversation with id: ${conversationID} does not exist.`)

    return res.status(OK).json(
        conversation, // Return the updated conversation object
    );
})