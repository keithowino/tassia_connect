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
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		location: {
			address: String,
			coordinates: {
				lat: Number,
				lng: Number,
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
		openingHours: {
			monday: { open: String, close: String },
			tuesday: { open: String, close: String },
			wednesday: { open: String, close: String },
			thursday: { open: String, close: String },
			friday: { open: String, close: String },
			saturday: { open: String, close: String },
			sunday: { open: String, close: String },
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Create slug from business name before saving
businessSchema.pre("save", function (next) {
	if (this.isModified("businessName")) {
		this.slug = this.businessName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	}
	next();
});

export default mongoose.model("Business", businessSchema);
