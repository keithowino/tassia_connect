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

// Hash password before saving - FIXED for Mongoose 6+
// DON'T use next() with async/await - just use async function
userSchema.pre("save", async function () {
	// Only hash the password if it has been modified (or is new)
	if (!this.isModified("password")) {
		return;
	}

	try {
		// Generate salt and hash password
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		throw error;
	}
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error) {
		throw error;
	}
};

export default mongoose.model("User", userSchema);
