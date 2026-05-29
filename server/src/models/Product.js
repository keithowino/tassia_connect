import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Business",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		category: {
			type: String,
			required: true,
		},
		images: [
			{
				type: String,
			},
		],
		isAvailable: {
			type: Boolean,
			default: true,
		},
		stock: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Product", productSchema);
