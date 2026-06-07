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
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				content: { type: String, required: true, maxlength: 500 },
				createdAt: { type: Date, default: Date.now },
			},
		],
		commentsCount: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	},
);

// Virtual for like count
communityPostSchema.virtual("likesCount").get(function () {
	return this.likes?.length || 0;
});

// Virtual for dislike count
communityPostSchema.virtual("dislikesCount").get(function () {
	return this.dislikes?.length || 0;
});

communityPostSchema.set("toJSON", { virtuals: true });
communityPostSchema.set("toObject", { virtuals: true });

// FIXED: For Mongoose 6+, don't use next() with async/await
// Use regular function and no next parameter
communityPostSchema.pre(/^find/, function () {
	// 'this' refers to the query
	this.populate("authorId", "fullName email profileImage");
});

export default mongoose.model("CommunityPost", communityPostSchema);
