import { Router } from "express";
import { createMessageController, getMessagesController } from "../controllers/message.controller.js";


const messageRoutes = Router();

messageRoutes.post("/create/:id",  createMessageController);
messageRoutes.get("/conversation/:id", getMessagesController);


export default messageRoutes;