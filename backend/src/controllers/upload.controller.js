import { uploadToCloudinary } from "../service/upload.service.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { BAD_REQUEST, OK } from "../utils/constants/http.js";
import { parseBuffer } from "music-metadata";


export const uploadImageController = catchErrors(
    async (req, res) => {
        const file = req.file;

        appAssert(file, BAD_REQUEST, "No image file uploaded.");

        const result = await uploadToCloudinary(file.buffer, "rhythm-player/images", "image");

        return res.status(OK).json({
            message: "Image uploaded successfully",
            imageUrl: result.secure_url,
            public_id: result.public_id,
        })
    }
)

export const uploadAudioController = catchErrors(
    async (req, res) => {
        const file = req.file;

        appAssert(file, BAD_REQUEST, "No audio file uploaded.");

        // Step 1: Extract duration
        const metadata = await parseBuffer(file.buffer, file.mimetype);
        const durationInSeconds = Math.floor(metadata.format.duration || 0);

        // Step 2: Upload to Cloudinary using existing service
        const result = await uploadToCloudinary(file.buffer, "rhythm-player/audio", "video");

        return res.status(OK).json({
            message: "Audio uploaded successfully",
            audioUrl: result.secure_url,
            public_id: result.public_id,
            duration: durationInSeconds,
        });
    }
);