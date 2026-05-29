import express from "express";
import {
	createOrder,
	getMyOrders,
	getBusinessOrders,
	updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/business/:businessId", protect, getBusinessOrders);
router.patch("/:id/status", protect, updateOrderStatus);

export default router;
