import express from "express";
import {
	createOrder,
	getMyOrders,
	getBusinessOrders,
	updateOrderStatus,
	getAllOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Add this new route BEFORE your existing routes
// Get all orders (admin only)
router.get("/", protect, adminOnly, getAllOrders);

router.use(protect);
router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/business/:businessId", getBusinessOrders);
router.patch("/:id/status", updateOrderStatus);

// Update payment status (admin only)
router.patch("/:id/payment-status", adminOnly, async (req, res) => {
	try {
		const { paymentStatus } = req.body;
		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ paymentStatus },
			{ new: true },
		);
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
