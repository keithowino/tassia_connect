import express from "express";
import {
	getAllCategories,
	getCategoryBySlug,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	getBusinessesByCategory,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.get("/:slug/businesses", getBusinessesByCategory);

// Admin only routes
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
