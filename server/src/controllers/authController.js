import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

// Register user
export const register = async (req, res) => {
	try {
		const { email, password, fullName, role } = req.body;

		// Validate required fields
		if (!email || !password || !fullName) {
			return res.status(400).json({
				message: "Please provide email, password, and full name",
			});
		}

		// Check if user exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Create user
		const user = await User.create({
			email,
			password,
			fullName,
			role: role || "user",
		});

		const token = generateToken(user._id);

		res.status(201).json({
			_id: user._id,
			email: user.email,
			fullName: user.fullName,
			role: user.role,
			token,
		});
	} catch (error) {
		console.error("Registration error:", error);
		console.error("Error details:", error.message);
		console.error("Stack trace:", error.stack);

		// Send more specific error message
		res.status(500).json({
			message: error.message || "Registration failed",
			error:
				process.env.NODE_ENV === "development"
					? error.stack
					: undefined,
		});
	}
};

// Login user
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password))) {
			return res
				.status(401)
				.json({ message: "Invalid email or password" });
		}

		const token = generateToken(user._id);

		res.json({
			_id: user._id,
			email: user.email,
			fullName: user.fullName,
			role: user.role,
			token,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get current user
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Google Sign In
export const googleSignIn = async (req, res) => {
	try {
		const { email, fullName, googleId, picture } = req.body;

		console.log("Google sign in attempt for:", email);

		if (!email || !fullName || !googleId) {
			return res.status(400).json({
				message: "Missing required Google user data",
			});
		}

		// Check if user exists
		let user = await User.findOne({ email });

		if (!user) {
			// Create new user
			user = await User.create({
				email,
				fullName,
				password: googleId + Math.random().toString(36), // Random password since they use Google
				authProvider: "google",
				profileImage: picture || null,
				isActive: true,
				role: "user", // Default role, can be updated later
			});

			console.log("New Google user created:", user._id);
		} else {
			console.log("Existing Google user logged in:", user._id);
		}

		const token = generateToken(user._id);

		res.json({
			_id: user._id,
			email: user.email,
			fullName: user.fullName,
			role: user.role,
			profileImage: user.profileImage,
			token,
		});
	} catch (error) {
		console.error("Google Sign-In error:", error);
		res.status(500).json({
			message: error.message || "Google sign in failed",
		});
	}
};
