import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
	let token;

	// Check for token in headers
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from token (exclude password)
			req.user = await User.findById(decoded.id).select("-password");

			if (!req.user) {
				return res.status(401).json({ message: "User not found" });
			}

			// IMPORTANT: Call next() to continue to the route handler
			return next();
		} catch (error) {
			console.error("Token verification error:", error.message);
			return res
				.status(401)
				.json({ message: "Not authorized, token failed" });
		}
	}

	// If no token found
	if (!token) {
		return res.status(401).json({ message: "Not authorized, no token" });
	}
};

export const adminOnly = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ message: "Admin access required" });
	}
};
