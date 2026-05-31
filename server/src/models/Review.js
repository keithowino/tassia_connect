// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema(
// 	{
// 		businessId: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "Business",
// 			required: true,
// 		},
// 		userId: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User",
// 			required: true,
// 		},
// 		rating: {
// 			type: Number,
// 			required: true,
// 			min: 1,
// 			max: 5,
// 		},
// 		comment: {
// 			type: String,
// 			required: true,
// 			trim: true,
// 			maxlength: 1000,
// 		},
// 		isVerified: {
// 			type: Boolean,
// 			default: false,
// 		},
// 		helpful: {
// 			type: Number,
// 			default: 0,
// 		},
// 		reported: {
// 			type: Boolean,
// 			default: false,
// 		},
// 	},
// 	{
// 		timestamps: true,
// 	},
// );

// // Ensure a user can only review a business once
// reviewSchema.index({ businessId: 1, userId: 1 }, { unique: true });

// // Populate user and business info when querying
// reviewSchema.pre(/^find/, function (next) {
// 	this.populate("userId", "fullName email profileImage").populate(
// 		"businessId",
// 		"businessName slug",
// 	);
// 	next();
// });

// export default mongoose.model("Review", reviewSchema);

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
