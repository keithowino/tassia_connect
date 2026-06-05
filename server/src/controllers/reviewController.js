import Review from "../models/Review.js";
import Business from "../models/Business.js";

// Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
	try {
		const reviews = await Review.find()
			.populate("userId", "fullName email profileImage")
			.populate("businessId", "businessName slug category")
			.sort({ createdAt: -1 });

		res.json(reviews);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get reviews for a specific business
export const getBusinessReviews = async (req, res) => {
	try {
		const { businessId } = req.params;
		const reviews = await Review.find({ businessId })
			.populate("userId", "fullName email profileImage")
			.sort({ createdAt: -1 });

		// Calculate average rating
		const avgRating =
			reviews.length > 0
				? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
				: 0;

		res.json({
			reviews,
			averageRating: avgRating.toFixed(1),
			totalReviews: reviews.length,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create a review
export const createReview = async (req, res) => {
	try {
		const { businessId, rating, comment } = req.body;

		// Check if user already reviewed this business
		const existingReview = await Review.findOne({
			businessId,
			userId: req.user._id,
		});

		if (existingReview) {
			return res
				.status(400)
				.json({ message: "You have already reviewed this business" });
		}

		const review = await Review.create({
			businessId,
			userId: req.user._id,
			rating,
			comment,
		});

		await review.populate("userId", "fullName email profileImage");

		res.status(201).json(review);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update a review
export const updateReview = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating, comment } = req.body;

		const review = await Review.findById(id);

		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}

		// Check if user owns the review or is admin
		if (
			review.userId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		review.rating = rating || review.rating;
		review.comment = comment || review.comment;
		await review.save();

		res.json(review);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete a review
export const deleteReview = async (req, res) => {
	try {
		const { id } = req.params;

		const review = await Review.findById(id);

		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}

		// Check if user owns the review or is admin
		if (
			review.userId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		await review.deleteOne();
		res.json({ message: "Review deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
