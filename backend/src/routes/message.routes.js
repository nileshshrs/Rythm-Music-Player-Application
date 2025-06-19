import { Router } from "express";
import { createMessageController } from "../controllers/message.controller.js";


const messageRoutes = Router();

messageRoutes.post("/create,",  createMessageController);

export default messageRoutes;