import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { createAlbumController, getAlbumByIDController, getAllAlbumsController } from "../controllers/album.controller.js";

const albumRoutes = Router();
albumRoutes.post("/create", createAlbumController);
albumRoutes.get("/all", getAllAlbumsController);
albumRoutes.get("/:id", getAlbumByIDController);

export default albumRoutes;