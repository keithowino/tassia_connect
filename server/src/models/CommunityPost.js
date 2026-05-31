import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		content: {
			type: String,
			required: true,
			maxlength: 5000,
		},
		type: {
			type: String,
			enum: ["general", "deal", "announcement", "news", "wanted"],
			default: "general",
		},
		authorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		pinned: {
			type: Boolean,
			default: false,
		},
		imageUrl: {
			type: String,
			default: null,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				content: String,
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{
		timestamps: true,
	},
);

// FIXED: For Mongoose 6+, don't use next() with async/await
// Use regular function and no next parameter
communityPostSchema.pre(/^find/, function () {
	// 'this' refers to the query
	this.populate("authorId", "fullName email profileImage");
});

// Alternative if you need to use next (callback style):
// communityPostSchema.pre(/^find/, function(next) {
//   this.populate("authorId", "fullName email profileImage");
//   next();
// });

export default mongoose.model("CommunityPost", communityPostSchema);
