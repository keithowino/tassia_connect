import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			default: "",
		},
		icon: {
			type: String,
			default: "Store",
		},
		color: {
			type: String,
			default: "#6b7280",
		},
		sortOrder: {
			type: Number,
			default: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		parentCategory: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

// Create slug before saving
categorySchema.pre("save", function () {
	if (this.isModified("name")) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	}
});

export default mongoose.model("Category", categorySchema);
