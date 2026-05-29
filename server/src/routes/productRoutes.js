import express from "express";
import {
	getProductsByBusiness,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/business/:businessId", getProductsByBusiness);
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
