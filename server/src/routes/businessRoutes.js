import express from "express";
import {
	getAllBusinesses,
	getBusinessBySlug,
	getMyBusinesses,
	createBusiness,
	updateBusiness,
} from "../controllers/businessController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllBusinesses);
router.get("/my", protect, getMyBusinesses);
router.get("/slug/:slug", getBusinessBySlug);
router.post("/", protect, createBusiness);
router.put("/:id", protect, updateBusiness);

export default router;
