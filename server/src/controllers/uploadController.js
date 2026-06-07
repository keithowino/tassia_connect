import { v2 as cloudinary } from "cloudinary";

// Single image upload
export const uploadSingleImage = async (req, res) => {
	try {
		console.log("Upload request received:", req.file);
		console.log("Request body:", req.body);

		if (!req.file) {
			console.log("No file in request");
			return res.status(400).json({ message: "No file uploaded" });
		}

		console.log("File uploaded successfully:", req.file.path);

		res.json({
			url: req.file.path,
			publicId: req.file.filename,
			message: "Upload successful",
		});
	} catch (error) {
		console.error("Upload error:", error);
		res.status(500).json({
			message: error.message || "Upload failed",
			error:
				process.env.NODE_ENV === "development"
					? error.stack
					: undefined,
		});
	}
};

// Multiple images upload
export const uploadMultipleImages = async (req, res) => {
	try {
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ message: "No files uploaded" });
		}

		const files = req.files.map((file) => ({
			url: file.path,
			publicId: file.filename,
		}));

		res.json({
			files,
			message: `${files.length} files uploaded successfully`,
		});
	} catch (error) {
		console.error("Multiple upload error:", error);
		res.status(500).json({
			message: error.message || "Upload failed",
		});
	}
};

// Delete image
export const deleteImage = async (req, res) => {
	try {
		const { publicId } = req.params;

		if (!publicId) {
			return res.status(400).json({ message: "Public ID required" });
		}

		const result = await cloudinary.uploader.destroy(publicId);

		if (result.result === "ok") {
			res.json({ message: "Image deleted successfully" });
		} else {
			res.status(404).json({ message: "Image not found" });
		}
	} catch (error) {
		console.error("Delete error:", error);
		res.status(500).json({ message: error.message });
	}
};
