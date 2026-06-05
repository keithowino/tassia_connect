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
		console.error("Error fetching products:", error);
		res.status(500).json({ message: error.message });
	}
};

// Create product
export const createProduct = async (req, res) => {
	try {
		console.log("Creating product for business:", req.body.businessId);

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

		// Transform frontend data to match model structure
		const productData = {
			businessId: req.body.businessId,
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			category: req.body.category || "general",
			// Convert single image_url to images array
			images: req.body.image_url ? [req.body.image_url] : [],
			isAvailable:
				req.body.isAvailable !== undefined
					? req.body.isAvailable
					: true,
			stock: req.body.stock || 0,
		};

		const product = await Product.create(productData);
		console.log("Product created successfully:", product._id);

		res.status(201).json(product);
	} catch (error) {
		console.error("Create product error:", error);
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

		// Transform frontend data to match model structure
		const updateData = {
			...(req.body.name && { name: req.body.name }),
			...(req.body.description && { description: req.body.description }),
			...(req.body.price !== undefined && { price: req.body.price }),
			...(req.body.category && { category: req.body.category }),
			...(req.body.image_url && { images: [req.body.image_url] }),
			...(req.body.isAvailable !== undefined && {
				isAvailable: req.body.isAvailable,
			}),
			...(req.body.stock !== undefined && { stock: req.body.stock }),
		};

		const updated = await Product.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ returnDocument: "after", runValidators: true },
		);

		res.json(updated);
	} catch (error) {
		console.error("Update product error:", error);
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
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Delete product error:", error);
		res.status(500).json({ message: error.message });
	}
};

// Get single product by ID
export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		console.error("Get product error:", error);
		res.status(500).json({ message: error.message });
	}
};

// Get all products (admin only)
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({})
			.populate("businessId", "businessName ownerId")
			.sort({ createdAt: -1 });

		res.json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
