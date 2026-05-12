const metadata = {
	name: "Tassia Connect",
	parentCompany: {
		name: "Pickaxe & Shovel",
		link: "https://pickaxe-and-shovel.vercel.app/",
	},
};

const dummyPosts = [
	{
		id: 1,
		type: "deal",
		pinned: true,
		title: "50% off the Jordans at sneaker world!",
		content:
			"Step into the game with the iconic Jordans – Style #AJ23. Sleek design, unbeatable comfort, and that legendary streetwear edge. Special Price: Only for this week! Hurry – stock is flying off fast! Own the look. Own the legend. DM now to secure your pair before they’re gone!",
		profiles: {
			full_name: "Sneaker World",
		},
		created_at: "2024-06-01T10:00:00Z",
	},
	{
		id: 2,
		type: "deal",
		pinned: true,
		title: "50% off the Jordans at sneaker world!",
		content:
			"Step into the game with the iconic Jordans – Style #AJ23. Sleek design, unbeatable comfort, and that legendary streetwear edge. Special Price: Only for this week! Hurry – stock is flying off fast! Own the look. Own the legend. DM now to secure your pair before they’re gone!",
		profiles: {
			full_name: "Sneaker World",
		},
		created_at: "2024-06-01T10:00:00Z",
	},
];

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
		name: "Saloon & Beauty",
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

const dummyBusinesses = [
	{
		id: 1,
		slug: "",
		name: "Pickaxe & Shovel",
		featured: true,
		categories: {
			name: "Electronics & Repair",
			color: "#0000ff",
			slug: "electronics-repair",
		},
		tagline: "",
		cover_image: "",
		average_rating: 5,
		review_count: 5,
		location_label: "",
		opening_time: "",
		closing_time: "",
		open_days: "",
		delivery_available: true,
	},
	{
		id: 2,
		slug: "",
		name: "Preemie",
		featured: true,
		categories: {
			name: "Electronics & Repair",
			color: "#0000ff",
			slug: "electronics-repair",
		},
		tagline: "",
		cover_image: "",
		average_rating: 3,
		review_count: 4,
		location_label: "",
		opening_time: "",
		closing_time: "",
		open_days: "",
		delivery_available: true,
	},
];

const dummyUserProfile = {
	avatar_url: "https://www.loremfaces.net/128/id/1.jpg",
	full_name: "Thompson Thompson",
	role: "user",
};

export default {
	metadata,
	dummyPosts,
	dummyCategories,
	dummyBusinesses,
	dummyUserProfile,
};
