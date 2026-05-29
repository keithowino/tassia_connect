import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Business",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Ensure a user can only favorite a business once
favoriteSchema.index({ userId: 1, businessId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
