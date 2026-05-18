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

const TYPE_OPTIONS = ["general", "deal", "announcement", "news", "wanted"];

const TYPE_OPTION_COLORS = {
	deal: "bg-green-100 text-green-700",
	announcement: "bg-blue-100 text-blue-700",
	news: "bg-orange-100 text-orange-700",
	wanted: "bg-red-100 text-red-700",
	general: "bg-gray-100 text-gray-600",
};

export default {
	metadata,
	dummyCategories,
	dummyFavorites,
	TYPE_OPTIONS,
	TYPE_OPTION_COLORS,
};
