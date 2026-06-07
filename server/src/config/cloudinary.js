import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";

const envFile =
	process.env.NODE_ENV === "production"
		? ".env.production"
		: ".env.development";
dotenv.config({ path: envFile });

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
console.log(
	"Cloudinary configured with cloud_name:",
	process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌ Missing",
);

// Create storage engine
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: async (req, file) => {
		// Determine folder based on file fieldname
		let folder = "tassia-connect/general";
		if (file.fieldname === "coverImage")
			folder = "tassia-connect/businesses/covers";
		else if (file.fieldname === "logo")
			folder = "tassia-connect/businesses/logos";
		else if (file.fieldname === "productImage")
			folder = "tassia-connect/products";
		else if (file.fieldname === "avatar")
			folder = "tassia-connect/users/avatars";
		else if (file.fieldname === "image") folder = "tassia-connect/uploads";

		return {
			folder: folder,
			allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
			transformation: [{ width: 1200, height: 1200, crop: "limit" }],
			public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
		};
	},
});

// Create multer upload instance with file filter
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|webp|gif/;
	const extname = allowedTypes.test(file.originalname.toLowerCase());
	const mimetype = allowedTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb(
			new Error(
				"Only image files are allowed (jpeg, jpg, png, webp, gif)",
			),
		);
	}
};

export const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: fileFilter,
});
