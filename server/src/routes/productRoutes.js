import express from "express";
import {
	getProductsByBusiness,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/business/:businessId", getProductsByBusiness);
router.get("/:id", getProductById);

// Protected routes
router.use(protect);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
