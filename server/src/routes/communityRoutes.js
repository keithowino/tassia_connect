import express from "express";
import {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
	togglePin,
} from "../controllers/communityController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);

// Protected routes (require authentication)
router.use(protect);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

// Admin only routes
router.patch("/posts/:id/pin", adminOnly, togglePin);

export default router;
