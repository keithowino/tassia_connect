import express from "express";
import {
	getMyFavorites,
	addFavorite,
	removeFavorite,
	checkFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // All favorite routes require authentication

router.get("/", getMyFavorites);
router.post("/", addFavorite);
router.get("/check/:businessId", checkFavorite);
router.delete("/:businessId", removeFavorite);

export default router;
