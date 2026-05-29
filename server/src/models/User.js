import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		fullName: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "business_owner", "admin"],
			default: "user",
		},
		profileImage: {
			type: String,
			default: null,
		},
		phoneNumber: {
			type: String,
			default: null,
		},
		location: {
			type: String,
			default: null,
		},
		authProvider: {
			type: String,
			enum: ["email", "google"],
			default: "email",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
