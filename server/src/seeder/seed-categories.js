import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import path from "path";

const envFile =
	process.env.NODE_ENV === "production"
		? ".env.production"
		: ".env.development";
dotenv.config({ path: envFile });

const categories = [
	{
		name: "Restaurants & Cafes",
		slug: "restaurants-cafes",
		description: "Local eateries, cafes, and food joints",
		icon: "UtensilsCrossed",
		color: "#f97316",
		sortOrder: 1,
		isActive: true,
	},
	{
		name: "Salons & Barber",
		slug: "salons-barber",
		description: "Hair, beauty, and grooming services",
		icon: "Scissors",
		color: "#ec4899",
		sortOrder: 2,
		isActive: true,
	},
	{
		name: "Hardware & Construction",
		slug: "hardware-construction",
		description: "Building materials, tools, and hardware",
		icon: "Wrench",
		color: "#3b82f6",
		sortOrder: 3,
		isActive: true,
	},
	{
		name: "Pharmacies & Clinics",
		slug: "pharmacies-clinics",
		description: "Medical services and drug stores",
		icon: "Pill",
		color: "#10b981",
		sortOrder: 4,
		isActive: true,
	},
	{
		name: "Electronics & Phones",
		slug: "electronics-phones",
		description: "Phone repairs, electronics, and gadgets",
		icon: "Smartphone",
		color: "#6366f1",
		sortOrder: 5,
		isActive: true,
	},
	{
		name: "Groceries & Supermarkets",
		slug: "groceries-supermarkets",
		description: "Foodstuff, household items, and fresh produce",
		icon: "ShoppingBasket",
		color: "#22c55e",
		sortOrder: 6,
		isActive: true,
	},
	{
		name: "Fashion & Clothing",
		slug: "fashion-clothing",
		description: "Clothing, shoes, and accessories",
		icon: "Shirt",
		color: "#f43f5e",
		sortOrder: 7,
		isActive: true,
	},
	{
		name: "Education & Tutoring",
		slug: "education-tutoring",
		description: "Schools, tutors, and learning centers",
		icon: "BookOpen",
		color: "#8b5cf6",
		sortOrder: 8,
		isActive: true,
	},
	{
		name: "Automotive & Mechanics",
		slug: "automotive-mechanics",
		description: "Car repair, spare parts, and services",
		icon: "Car",
		color: "#ef4444",
		sortOrder: 9,
		isActive: true,
	},
	{
		name: "Fitness & Wellness",
		slug: "fitness-wellness",
		description: "Gyms, yoga, and wellness centers",
		icon: "Wind",
		color: "#14b8a6",
		sortOrder: 10,
		isActive: true,
	},
];

async function seedCategories() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");

		// Clear existing categories (optional)
		await Category.deleteMany({});
		console.log("Cleared existing categories");

		// Insert new categories
		const result = await Category.insertMany(categories);
		console.log(`✅ Added ${result.length} categories`);

		// List all categories
		const allCategories = await Category.find().sort({ sortOrder: 1 });
		console.log("\n📋 Categories in database:");
		allCategories.forEach((cat) => {
			console.log(`   - ${cat.name} (${cat.slug})`);
		});

		await mongoose.disconnect();
		console.log("\n✅ Seeding complete!");
	} catch (error) {
		console.error("❌ Error seeding categories:", error);
		process.exit(1);
	}
}

seedCategories();
