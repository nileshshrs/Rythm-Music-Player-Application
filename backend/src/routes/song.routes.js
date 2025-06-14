import { Router } from "express";
import {
  createSongController,
  deleteSongController,
  editSongController,
  getAllSongsController,
  getSongsByIDController,
} from "../controllers/songs.controller.js";

const songRoutes = Router();

songRoutes.post("/create", createSongController);
songRoutes.get("/all", getAllSongsController);
songRoutes.get("/:id", getSongsByIDController);
songRoutes.patch("/:id", editSongController);
songRoutes.delete("/:id", deleteSongController);


export default songRoutes;
