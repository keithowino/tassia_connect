import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Business",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: true,
			trim: true,
			maxlength: 1000,
		},
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				content: { type: String, required: true, maxlength: 500 },
				createdAt: { type: Date, default: Date.now },
			},
		],
		isVerified: {
			type: Boolean,
			default: false,
		},
		helpful: {
			type: Number,
			default: 0,
		},
		reported: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Virtuals
reviewSchema.virtual("likesCount").get(function () {
	return this.likes?.length || 0;
});

reviewSchema.virtual("dislikesCount").get(function () {
	return this.dislikes?.length || 0;
});

reviewSchema.virtual("commentsCount").get(function () {
	return this.comments?.length || 0;
});

reviewSchema.set("toJSON", { virtuals: true });
reviewSchema.set("toObject", { virtuals: true });

// Ensure a user can only review a business once
reviewSchema.index({ businessId: 1, userId: 1 }, { unique: true });

// FIXED: For Mongoose 6+, use regular function without next parameter
reviewSchema.pre(/^find/, function () {
	this.populate("userId", "fullName email profileImage").populate(
		"businessId",
		"businessName slug",
	);
});

export default mongoose.model("Review", reviewSchema);
