import mongoose from "mongoose";
import Favorite from "../models/Favorite.js";
import Business from "../models/Business.js";

// Get user's favorites
export const getMyFavorites = async (req, res) => {
	try {
		const favorites = await Favorite.find({ userId: req.user._id })
			.populate("businessId")
			.sort({ createdAt: -1 });

		res.json(favorites);
	} catch (error) {
		console.error("Get favorites error:", error);
		res.status(500).json({ message: error.message });
	}
};

// Add to favorites
export const addFavorite = async (req, res) => {
	try {
		const { businessId } = req.body;

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(businessId)) {
			return res
				.status(400)
				.json({ message: "Invalid business ID format" });
		}

		// Check if business exists
		const business = await Business.findById(businessId);
		if (!business) {
			return res.status(404).json({ message: "Business not found" });
		}

		// Check if already favorited
		const existing = await Favorite.findOne({
			userId: req.user._id,
			businessId: businessId,
		});

		if (existing) {
			return res.status(400).json({ message: "Already in favorites" });
		}

		const favorite = await Favorite.create({
			userId: req.user._id,
			businessId: businessId,
		});

		res.status(201).json(favorite);
	} catch (error) {
		console.error("Add favorite error:", error);
		res.status(500).json({ message: error.message });
	}
};

// Remove from favorites - FIXED
export const removeFavorite = async (req, res) => {
	try {
		const { businessId } = req.params;

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(businessId)) {
			return res
				.status(400)
				.json({ message: "Invalid business ID format" });
		}

		// Convert to ObjectId for proper comparison
		const businessObjectId = new mongoose.Types.ObjectId(businessId);

		const result = await Favorite.findOneAndDelete({
			userId: req.user._id,
			businessId: businessObjectId,
		});

		if (!result) {
			return res.status(404).json({ message: "Favorite not found" });
		}

		res.json({ message: "Removed from favorites" });
	} catch (error) {
		console.error("Remove favorite error:", error);
		res.status(500).json({ message: error.message });
	}
};

// Check if business is favorited
export const checkFavorite = async (req, res) => {
	try {
		const { businessId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(businessId)) {
			return res
				.status(400)
				.json({ message: "Invalid business ID format" });
		}

		const favorite = await Favorite.findOne({
			userId: req.user._id,
			businessId: businessId,
		});

		res.json({ isFavorited: !!favorite });
	} catch (error) {
		console.error("Check favorite error:", error);
		res.status(500).json({ message: error.message });
	}
};
