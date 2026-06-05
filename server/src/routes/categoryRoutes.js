import express from "express";
import {
	getAllCategories,
	getCategoryBySlug,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	getBusinessesByCategory,
	getAllCategoriesAdmin,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.get("/:slug/businesses", getBusinessesByCategory);

// Admin only routes
router.use(protect, adminOnly);
router.get("/admin/all", getAllCategoriesAdmin);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
