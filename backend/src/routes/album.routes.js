import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import { createAlbumController, getAllAlbumsController } from "../controllers/album.controller.js";

const albumRoutes = Router();
albumRoutes.post("/create",authenticate, createAlbumController);
albumRoutes.get("/all", getAllAlbumsController);

export default albumRoutes;