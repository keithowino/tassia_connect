import express from "express";
import {
	getAllReviews,
	getBusinessReviews,
	createReview,
	updateReview,
	deleteReview,
	toggleReviewLike,
	toggleReviewDislike,
	addReviewComment,
	deleteReviewComment,
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

// Reaction routes
router.post("/:id/like", toggleReviewLike);
router.post("/:id/dislike", toggleReviewDislike);
router.post("/:id/comments", addReviewComment);
router.delete("/:id/comments/:commentId", deleteReviewComment);

// Admin only routes
router.get("/", adminOnly, getAllReviews);

export default router;
