const metadata = {
	name: "Tassia Connect",
	parentCompany: {
		name: "Pickaxe & Shovel",
		link: "https://pickaxe-and-shovel.vercel.app/",
	},
};

const dummyCategories = [
	{
		id: 1,
		slug: "food-drinks",
		color: "#990055",
		name: "Food & Drinks",
		icon: "UtensilsCrossed",
	},
	{
		id: 2,
		slug: "salon-beauty",
		color: "pink",
		name: "Salon & Beauty",
		icon: "Scissors",
	},
	{
		id: 3,
		slug: "hardware-building",
		color: "orange",
		name: "Hardware & Building",
		icon: "Wrench",
	},
	{
		id: 4,
		slug: "pharmacy-health",
		color: "green",
		name: "Pharmacy & Health",
		icon: "Pill",
	},
	{
		id: 5,
		slug: "electronics-repair",
		color: "blue",
		name: "Electronics & Repair",
		icon: "Smartphone",
	},
	{
		id: 6,
		slug: "grocery",
		color: "#aaddaa",
		name: "Grocery & Supermarket",
		icon: "ShoppingBasket",
	},
	{
		id: 7,
		slug: "laundry",
		color: "#aaaadd",
		name: "Laundry Services",
		icon: "Wind",
	},
	{
		id: 8,
		slug: "medical-clinic",
		color: "purple",
		name: "Medical & Clinic",
		icon: "Stethoscope",
	},
	{
		id: 9,
		slug: "street-food",
		color: "#990033",
		name: "Street & Food & Snacks",
		icon: "Coffee",
	},
	{
		id: 10,
		slug: "financial",
		color: "purple",
		name: "Financial Services",
		icon: "Banknote",
	},
	{
		id: 11,
		slug: "clothing-fashion",
		color: "orange",
		name: "Clothing & Fashion",
		icon: "Shirt",
	},
	{
		id: 12,
		slug: "education",
		color: "green",
		name: "Education & Training",
		icon: "BookOpen",
	},
];

const dummyFavorites = [
	{ user_id: 1, business_id: 1 },
	{ user_id: 1, business_id: 5 },
];

const dummyProductsServices = [
	{
		id: 1,
		name: "iPhone 13 Screen Replacement",
		type: "service",
		image_url:
			"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
		description:
			"Professional iPhone 13 screen replacement service with high-quality display parts and same-day repair.",
		price: 8500,
	},
	{
		id: 2,
		name: "Wireless Bluetooth Headphones",
		type: "product",
		image_url:
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
		description:
			"Noise-cancelling wireless headphones with deep bass, long battery life, and fast charging support.",
		price: 3200,
	},
	{
		id: 3,
		name: "Hair Braiding Service",
		type: "service",
		image_url:
			"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
		description:
			"Professional knotless braiding and protective hairstyling for all hair types.",
		price: 2500,
	},
	{
		id: 4,
		name: "Fresh Organic Tomatoes",
		type: "product",
		image_url:
			"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop",
		description:
			"Farm-fresh organic tomatoes sold per kilogram with same-day local delivery available.",
		price: 120,
	},
	{
		id: 5,
		name: "Laundry Wash & Fold",
		type: "service",
		image_url:
			"https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
		description:
			"Complete laundry wash, drying, folding, and ironing package for everyday clothing.",
		price: 800,
	},
	{
		id: 6,
		name: "Gaming Mechanical Keyboard",
		type: "product",
		image_url:
			"https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200&auto=format&fit=crop",
		description:
			"RGB mechanical keyboard with blue switches, anti-ghosting, and ergonomic wrist support.",
		price: 4500,
	},
	{
		id: 7,
		name: "Web Development Training",
		type: "service",
		image_url:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
		description:
			"Hands-on beginner-friendly web development classes covering HTML, CSS, JavaScript, and React.",
		price: 15000,
	},
	{
		id: 8,
		name: "Premium Beard Oil",
		type: "product",
		image_url:
			"https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop",
		description:
			"Natural beard oil formulated to moisturize, soften, and promote healthy beard growth.",
		price: 950,
	},
	{
		id: 9,
		name: "Laptop Cleaning Service",
		type: "service",
		image_url:
			"https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
		description:
			"Internal and external laptop cleaning service including fan dust removal and thermal paste replacement.",
		price: 1800,
	},
	{
		id: 10,
		name: "Smart LED TV 43 Inch",
		type: "product",
		image_url:
			"https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1200&auto=format&fit=crop",
		description:
			"43-inch smart Android TV with Netflix, YouTube, screen casting, and ultra HD display support.",
		price: 32000,
	},
];

const TYPE_OPTIONS = ["general", "deal", "announcement", "news", "wanted"];

const TYPE_OPTION_COLORS = {
	deal: "bg-green-100 text-green-700",
	announcement: "bg-blue-100 text-blue-700",
	news: "bg-orange-100 text-orange-700",
	wanted: "bg-red-100 text-red-700",
	general: "bg-gray-100 text-gray-600",
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

export default {
	metadata,
	dummyCategories,
	dummyFavorites,
	TYPE_OPTIONS,
	TYPE_OPTION_COLORS,
	dummyProductsServices,
	days,
	today,
};
