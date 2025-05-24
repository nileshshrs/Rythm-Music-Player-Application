import { Router } from "express";
import { createSongController, getAllSongsController, getSongsByIDController } from "../controllers/songs.controller.js";

const songRoutes = Router();

songRoutes.post("/create", createSongController)
songRoutes.get("/all", getAllSongsController)
songRoutes.get("/:id", getSongsByIDController)


export default songRoutes;