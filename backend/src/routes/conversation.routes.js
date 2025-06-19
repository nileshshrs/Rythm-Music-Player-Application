import { Router } from "express";
import { createConversationController, getConversationByIDController, getConversationController } from "../controllers/conversation.controller.js";

const conversationRoutes = Router()

conversationRoutes.post("/create", createConversationController)
conversationRoutes.get("/all", getConversationController)
conversationRoutes.get("/:id", getConversationByIDController) // Assuming you want to get a conversation by ID

export default conversationRoutes