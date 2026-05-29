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
		res.status(500).json({ message: error.message });
	}
};

// Add to favorites
export const addFavorite = async (req, res) => {
	try {
		const { businessId } = req.body;

		// Check if business exists
		const business = await Business.findById(businessId);
		if (!business) {
			return res.status(404).json({ message: "Business not found" });
		}

		// Check if already favorited
		const existing = await Favorite.findOne({
			userId: req.user._id,
			businessId,
		});

		if (existing) {
			return res.status(400).json({ message: "Already in favorites" });
		}

		const favorite = await Favorite.create({
			userId: req.user._id,
			businessId,
		});

		res.status(201).json(favorite);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Remove from favorites
export const removeFavorite = async (req, res) => {
	try {
		const { businessId } = req.params;

		const result = await Favorite.findOneAndDelete({
			userId: req.user._id,
			businessId,
		});

		if (!result) {
			return res.status(404).json({ message: "Favorite not found" });
		}

		res.json({ message: "Removed from favorites" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Check if business is favorited
export const checkFavorite = async (req, res) => {
	try {
		const { businessId } = req.params;

		const favorite = await Favorite.findOne({
			userId: req.user._id,
			businessId,
		});

		res.json({ isFavorited: !!favorite });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
