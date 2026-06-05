import Category from "../models/Category.js";
import Business from "../models/Business.js";

// // Get all categories
// export const getAllCategories = async (req, res) => {
// 	try {
// 		const categories = await Category.find({ isActive: true }).sort({
// 			sortOrder: 1,
// 			name: 1,
// 		});

// 		// Get business count for each category
// 		const categoriesWithCount = await Promise.all(
// 			categories.map(async (category) => {
// 				const businessCount = await Business.countDocuments({
// 					category: category.name,
// 					isActive: true,
// 				});

// 				return {
// 					...category.toObject(),
// 					businessCount,
// 				};
// 			}),
// 		);

// 		res.json(categoriesWithCount);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({ isActive: true }).sort({
			sortOrder: 1,
			name: 1,
		});

		// Get business count for each category
		const categoriesWithCount = await Promise.all(
			categories.map(async (category) => {
				const businessCount = await Business.countDocuments({
					category: category.name,
					isActive: true,
				});

				return {
					...category.toObject(),
					businessCount,
				};
			}),
		);

		res.json(categoriesWithCount);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get all categories for admin
export const getAllCategoriesAdmin = async (req, res) => {
	try {
		const categories = await Category.find({}).sort({
			sortOrder: 1,
			name: 1,
		});

		// Get business count for each category (count active businesses only)
		const categoriesWithCount = await Promise.all(
			categories.map(async (category) => {
				const businessCount = await Business.countDocuments({
					category: category.name,
					isActive: true,
				});

				return {
					...category.toObject(),
					businessCount,
				};
			}),
		);

		res.json(categoriesWithCount);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get category by ID
export const getCategoryById = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
	try {
		const category = await Category.findOne({ slug: req.params.slug });
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}
		res.json(category);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get businesses by category slug
export const getBusinessesByCategory = async (req, res) => {
	try {
		const { slug } = req.params;

		// First find the category to get the name
		const category = await Category.findOne({ slug });
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		// Find businesses with this category
		const businesses = await Business.find({
			category: category.name,
			isActive: true,
		}).populate("ownerId", "fullName email");

		res.json({
			category,
			businesses,
			count: businesses.length,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create category (admin only)
export const createCategory = async (req, res) => {
	try {
		// Check if category already exists
		const existingCategory = await Category.findOne({
			name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
		});

		if (existingCategory) {
			return res.status(400).json({ message: "Category already exists" });
		}

		const category = await Category.create(req.body);
		res.status(201).json(category);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Update category (admin only)
export const updateCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		const updated = await Category.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ returnDocument: "after", runValidators: true },
		);

		res.json(updated);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		// Check if any businesses use this category
		const businessesUsing = await Business.countDocuments({
			category: category.name,
		});

		if (businessesUsing > 0) {
			return res.status(400).json({
				message: `Cannot delete category. ${businessesUsing} business(es) are using it.`,
			});
		}

		await category.deleteOne();
		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
