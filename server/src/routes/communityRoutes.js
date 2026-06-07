import express from "express";
import {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
	togglePin,
	togglePostLike,
	togglePostDislike,
	addPostComment,
	deletePostComment,
} from "../controllers/communityController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);

// Protected routes
router.use(protect);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

// Reaction routes
router.post("/posts/:id/like", togglePostLike);
router.post("/posts/:id/dislike", togglePostDislike);
router.post("/posts/:id/comments", addPostComment);
router.delete("/posts/:id/comments/:commentId", deletePostComment);

// Admin only routes
router.patch("/posts/:id/pin", adminOnly, togglePin);

export default router;
