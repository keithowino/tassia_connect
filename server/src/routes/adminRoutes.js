import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Business from "../models/Business.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import CommunityPost from "../models/CommunityPost.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Get stats
router.get("/stats", async (req, res) => {
	try {
		const [
			totalUsers,
			totalBusinesses,
			totalOrders,
			totalReviews,
			totalPosts,
		] = await Promise.all([
			User.countDocuments(),
			Business.countDocuments(),
			Order.countDocuments(),
			Review.countDocuments(),
			CommunityPost.countDocuments(),
		]);

		res.json({
			totalUsers,
			totalBusinesses,
			totalOrders,
			totalReviews,
			totalPosts,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update user role
router.put("/users/:userId/role", async (req, res) => {
	try {
		const { role } = req.body;
		const user = await User.findByIdAndUpdate(
			req.params.userId,
			{ role },
			{ new: true },
		).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Update user role error:", error);
		res.status(500).json({ message: error.message });
	}
});

export default router;
