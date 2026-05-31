import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
	{
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		businessName: {
			type: String,
			required: true,
			trim: true,
		},
		tagline: {
			type: String,
			default: "",
			trim: true,
			maxlength: 100,
		},
		slug: {
			type: String,
			unique: true,
			sparse: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		whatsapp: {
			type: String,
			default: "",
			trim: true,
		},
		website: {
			type: String,
			default: "",
			trim: true,
		},
		location: {
			address: {
				type: String,
				default: "",
			},
			floor_unit: {
				type: String,
				default: "",
			},
			label: {
				type: String,
				default: "Tassia Complex",
			},
			coordinates: {
				lat: { type: Number, default: null },
				lng: { type: Number, default: null },
			},
		},
		logo: {
			type: String,
			default: null,
		},
		coverImage: {
			type: String,
			default: null,
		},
		opening_time: {
			type: String,
			default: "08:00",
		},
		closing_time: {
			type: String,
			default: "20:00",
		},
		open_days: [
			{
				type: String,
				enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			},
		],
		delivery_available: {
			type: Boolean,
			default: false,
		},
		delivery_fee: {
			type: Number,
			default: 0,
			min: 0,
		},
		min_order: {
			type: Number,
			default: 0,
			min: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		viewCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		averageRating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		reviewCount: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: true,
	},
);

// Generate slug before validation
businessSchema.pre("validate", function () {
	// Generate slug if not provided
	if (!this.slug && this.businessName) {
		let baseSlug = this.businessName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

		// Add timestamp to ensure uniqueness
		this.slug = `${baseSlug}-${Date.now().toString(36)}`;
	}
});

// Method to increment view count
businessSchema.methods.incrementViews = async function () {
	this.viewCount += 1;
	await this.save();
	return this.viewCount;
};

// Method to update rating (call this when a new review is added)
businessSchema.methods.updateRating = async function (newRating) {
	const totalRating = this.averageRating * this.reviewCount;
	this.reviewCount += 1;
	this.averageRating = (totalRating + newRating) / this.reviewCount;
	await this.save();
	return this.averageRating;
};

export default mongoose.model("Business", businessSchema);
