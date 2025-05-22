import multer from "multer";

// Memory storage (used for streaming to Cloudinary)
const storage = multer.memoryStorage();

// Image-only filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Audio-only filter
const audioFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed"), false);
  }
};

// Export two specific upload middlewares
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for images
});

export const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max for audio
});
