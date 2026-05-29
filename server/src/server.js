import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const envFile =
	process.env.NODE_ENV === "production"
		? ".env.production"
		: ".env.development";
dotenv.config({ path: envFile });

const requiredEnvVars = [
	"MONGODB_URI",
	"JWT_SECRET",
	"PORT",
	"NODE_ENV",
	"JWT_EXPIRES_IN",
	"CLIENT_URL",
];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.error("❌ Missing required environment variables:");
	missingEnvVars.forEach((envVar) => console.error(`   - ${envVar}`));
	console.error("\nPlease check your .env file");
	process.exit(1);
}

console.log(`Loading environment from: ${envFile}`);

const app = express();

// Middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:3000",
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		message: err.message || "Something went wrong!",
		error: process.env.NODE_ENV === "development" ? err : {},
	});
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("✅ Connected to MongoDB");
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("❌ MongoDB connection error:", error);
		process.exit(1);
	});
