import { Router } from "express";
import { addSongToPlaylistController, createEmptyPlaylistController, createPlaylistFromAlbumController, deletePlaylistController, getPlaylistByIdController, getPlaylistsByUserController, updatePlaylistController } from "../controllers/playlist.controller.js";


const playlistRoutes = Router();

playlistRoutes.post("/create", createEmptyPlaylistController)
playlistRoutes.get("/get-by-user", getPlaylistsByUserController);
playlistRoutes.get("/:id", getPlaylistByIdController);
playlistRoutes.patch("/update/:id", updatePlaylistController);
playlistRoutes.patch("/add-songs/:id", addSongToPlaylistController)
playlistRoutes.post("/create-from-album", createPlaylistFromAlbumController);
// src/routes/playlist.routes.js
playlistRoutes.delete("/delete/:id", deletePlaylistController);


export default playlistRoutes;