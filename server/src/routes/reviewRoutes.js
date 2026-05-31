import express from "express";
import {
	getAllReviews,
	getBusinessReviews,
	createReview,
	updateReview,
	deleteReview,
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/business/:businessId", getBusinessReviews);

// Protected routes
router.use(protect);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

// Admin only routes
router.get("/", adminOnly, getAllReviews);

export default router;
