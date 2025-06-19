import { conversationModel } from "../models/conversation.model.js";
import { messageModel } from "../models/message.model.js";


export const createMessage = async (message) => {
    const { sender, conversation, recipient, content } = message;


    const create = await messageModel.create({
        sender: sender,
        conversation: conversation,
        recipient: recipient,
        content: content,
    })

    await conversationModel.findByIdAndUpdate(conversation,
        {
            lastMessage: content,
            read: recipient
        }, { new: true }
    )

    return create;
}