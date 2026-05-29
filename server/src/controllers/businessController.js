import Business from "../models/Business.js";
import Product from "../models/Product.js";

// Get all businesses
export const getAllBusinesses = async (req, res) => {
	try {
		const businesses = await Business.find({ isActive: true })
			.populate("ownerId", "fullName email")
			.sort({ createdAt: -1 });
		res.json(businesses);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get business by slug
export const getBusinessBySlug = async (req, res) => {
	try {
		const business = await Business.findOne({
			slug: req.params.slug,
		}).populate("ownerId", "fullName email");

		if (!business) {
			return res.status(404).json({ message: "Business not found" });
		}

		// Get products for this business
		const products = await Product.find({
			businessId: business._id,
			isAvailable: true,
		});

		res.json({ ...business.toObject(), products });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get user's businesses
export const getMyBusinesses = async (req, res) => {
	try {
		const businesses = await Business.find({ ownerId: req.user._id });
		res.json(businesses);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create business
export const createBusiness = async (req, res) => {
	try {
		const business = await Business.create({
			...req.body,
			ownerId: req.user._id,
		});
		res.status(201).json(business);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update business
export const updateBusiness = async (req, res) => {
	try {
		const business = await Business.findById(req.params.id);

		if (!business) {
			return res.status(404).json({ message: "Business not found" });
		}

		if (
			business.ownerId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const updated = await Business.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);

		res.json(updated);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
