import Product from "../models/Product.js";
import Business from "../models/Business.js";

// Get products by business
export const getProductsByBusiness = async (req, res) => {
	try {
		const products = await Product.find({
			businessId: req.params.businessId,
			isAvailable: true,
		});
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create product
export const createProduct = async (req, res) => {
	try {
		// Verify user owns the business
		const business = await Business.findById(req.body.businessId);
		if (!business) {
			return res.status(404).json({ message: "Business not found" });
		}

		if (
			business.ownerId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const product = await Product.create(req.body);
		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update product
export const updateProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const business = await Business.findById(product.businessId);
		if (
			business.ownerId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const updated = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);

		res.json(updated);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete product
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const business = await Business.findById(product.businessId);
		if (
			business.ownerId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		await product.deleteOne();
		res.json({ message: "Product deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
