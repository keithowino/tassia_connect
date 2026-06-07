import express from "express";
import { upload } from "../config/cloudinary.js";
import { protect } from "../middleware/auth.js";
import {
	deleteImage,
	uploadMultipleImages,
	uploadSingleImage,
} from "../controllers/uploadController.js";

const router = express.Router();

router.use(protect);
router.post("/single", upload.single("image"), uploadSingleImage);
router.post("/multiple", upload.array("images", 5), uploadMultipleImages);
router.delete("/:publicId", deleteImage);

export default router;
