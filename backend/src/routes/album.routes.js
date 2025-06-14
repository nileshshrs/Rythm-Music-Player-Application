import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { createAlbumController, deleteAlbumController, editAlbumController, getAlbumByIDController, getAllAlbumsController } from "../controllers/album.controller.js";

const albumRoutes = Router();
albumRoutes.post("/create", createAlbumController);
albumRoutes.get("/all", getAllAlbumsController);
albumRoutes.get("/:id", getAlbumByIDController);
albumRoutes.patch("/update/:id", editAlbumController);
albumRoutes.delete("/delete/:id", deleteAlbumController);

export default albumRoutes;