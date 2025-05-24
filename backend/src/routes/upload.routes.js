import { Router } from "express";
import { uploadAudio, uploadImage } from "../middleware/multer.js";
import { uploadAudioController, uploadImageController } from "../controllers/upload.controller.js";

const uploadRoutes = Router();
uploadRoutes.post("/image", uploadImage.single("image"), uploadImageController)

uploadRoutes.post("/audio", uploadAudio.single("audio"), uploadAudioController)
export default uploadRoutes;