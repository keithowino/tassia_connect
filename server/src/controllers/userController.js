import User from "../models/User.js";

// Update user profile
export const updateProfile = async (req, res) => {
	try {
		const updates = {
			fullName: req.body.fullName,
			phoneNumber: req.body.phoneNumber,
			location: req.body.location,
			profileImage: req.body.profileImage,
		};

		const user = await User.findByIdAndUpdate(req.user._id, updates, {
			new: true,
			runValidators: true,
		}).select("-password");

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ message: "Admin access required" });
		}

		const users = await User.find().select("-password");
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
