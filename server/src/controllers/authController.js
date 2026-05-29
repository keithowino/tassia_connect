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
		res.status(500).json({ message: error.message });
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

// Google Sign In (simplified - you'll need to verify Google token)
export const googleSignIn = async (req, res) => {
	try {
		const { email, fullName, googleId } = req.body;

		let user = await User.findOne({ email });

		if (!user) {
			user = await User.create({
				email,
				fullName,
				password: googleId + Math.random().toString(36),
				authProvider: "google",
			});
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
