import { Router } from "express";
import {
  createSongController,
  deleteSongController,
  editSongController,
  getAllSongsController,
  getSongsByIDController,
} from "../controllers/songs.controller.js";
import authenticate from "../middleware/authenticate.js";

const songRoutes = Router();

songRoutes.post("/create", authenticate, createSongController);
songRoutes.get("/all", getAllSongsController);
songRoutes.get("/:id", getSongsByIDController);
songRoutes.patch("/:id", authenticate, editSongController);
songRoutes.delete("/:id", authenticate, deleteSongController);


export default songRoutes;
