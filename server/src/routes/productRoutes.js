import express from "express";
import {
	getProductsByBusiness,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	getAllProducts,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Add this new route BEFORE your existing routes
// Get all products (admin only)
router.get("/", protect, adminOnly, getAllProducts);

// Public routes
router.get("/business/:businessId", getProductsByBusiness);
router.get("/:id", getProductById);

// Protected routes
router.use(protect);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
