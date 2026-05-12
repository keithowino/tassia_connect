const metadata = {
	name: "Tassia Connect",
	parentCompany: {
		name: "Pickaxe & Shovel",
		link: "https://pickaxe-and-shovel.vercel.app/",
	},
};

const dummyCommunityPosts = [
	{
		id: 1,
		author_id: 1,
		type: "deal",
		pinned: true,
		title: "50% off the Jordans at Sneaker World!",
		content:
			"Step into the game with the iconic Jordans – Style #AJ23. Sleek design, unbeatable comfort, and that legendary streetwear edge. Special price available only this week. Hurry before stock runs out!",
		profiles: {
			full_name: "Sneaker World",
		},
		created_at: "2026-05-12T08:30:00",
	},

	{
		id: 2,
		author_id: 2,
		type: "announcement",
		pinned: false,
		title: "New Barber Now Available at Royal Touch",
		content:
			"We are excited to welcome Kevin the Barber to our team. Book your fresh fade or beard trim appointment starting this Friday.",
		profiles: {
			full_name: "Royal Touch Barbershop",
		},
		created_at: "2026-05-11T10:15:00",
	},

	{
		id: 3,
		author_id: 3,
		type: "news",
		pinned: false,
		title: "Nyeri Tech Meetup Happening This Saturday",
		content:
			"Developers, designers, and tech enthusiasts are invited for a networking and learning session at CodeCraft Academy this weekend.",
		profiles: {
			full_name: "CodeCraft Academy",
		},
		created_at: "2026-05-10T16:45:00",
	},

	{
		id: 4,
		author_id: 4,
		type: "wanted",
		pinned: false,
		title: "Looking for a Graphic Designer",
		content:
			"We are searching for a freelance graphic designer to help create promotional posters and social media content for our salon.",
		profiles: {
			full_name: "Glow House Salon",
		},
		created_at: "2026-05-09T13:20:00",
	},

	{
		id: 5,
		author_id: 5,
		type: "deal",
		pinned: true,
		title: "Buy 2 Shirts, Get 1 Free!",
		content:
			"Visit Urban Wear this weekend and enjoy a free shirt when you buy any two official branded outfits.",
		profiles: {
			full_name: "Urban Wear",
		},
		created_at: "2026-05-08T09:00:00",
	},

	{
		id: 6,
		author_id: 6,
		type: "general",
		pinned: false,
		title: "Best Coffee Spots Around Nyeri?",
		content:
			"I just moved here recently and I’m looking for recommendations for quiet coffee spots with good Wi-Fi and work-friendly environments.",
		profiles: {
			full_name: "Brian Mwangi",
		},
		created_at: "2026-05-07T18:10:00",
	},

	{
		id: 7,
		author_id: 7,
		type: "announcement",
		pinned: false,
		title: "Laundry Pickup Services Expanded",
		content:
			"Sparkle Laundry now offers free pickup and delivery services within Nyeri town for orders above KES 1000.",
		profiles: {
			full_name: "Sparkle Laundry",
		},
		created_at: "2026-05-06T11:40:00",
	},

	{
		id: 8,
		author_id: 8,
		type: "wanted",
		pinned: false,
		title: "Searching for a Part-Time Cashier",
		content:
			"Green Basket Market is hiring a reliable part-time cashier with good customer service and basic computer skills.",
		profiles: {
			full_name: "Green Basket Market",
		},
		created_at: "2026-05-05T15:30:00",
	},

	{
		id: 9,
		author_id: 9,
		type: "news",
		pinned: false,
		title: "Heavy Discounts on Electronics This Month",
		content:
			"Pickaxe & Shovel has announced major discounts on phone accessories, laptop repairs, and gaming equipment throughout May.",
		profiles: {
			full_name: "Pickaxe & Shovel",
		},
		created_at: "2026-05-04T14:00:00",
	},

	{
		id: 10,
		author_id: 10,
		type: "general",
		pinned: false,
		title: "Anyone Know a Good Math Tutor?",
		content:
			"I’m looking for a reliable mathematics tutor for high school level classes around Nyeri town. Recommendations are welcome.",
		profiles: {
			full_name: "Faith Wanjiku",
		},
		created_at: "2026-05-03T17:25:00",
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
		slug: "pickaxe-and-shovel",
		name: "Pickaxe & Shovel",
		description:
			"Reliable electronics repair shop offering phone fixing, laptop maintenance, accessories, and technical support services.",
		featured: true,
		categories: {
			name: "Electronics & Repair",
			color: "#2563eb",
			slug: "electronics-repair",
		},
		tagline: "Reliable gadget repairs and electronics accessories.",
		cover_image:
			"https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
		average_rating: 5,
		review_count: 5,
		location_label: "Kimathi Street, Nyeri",
		opening_time: "08:00",
		closing_time: "18:00",
		open_days: "Mon - Sat",
		delivery_available: true,
	},
	{
		id: 2,
		slug: "preemie-tech",
		name: "Preemie",
		description:
			"Affordable gadget repair and electronics store specializing in smartphones, laptops, chargers, and accessories.",
		featured: true,
		categories: {
			name: "Electronics & Repair",
			color: "#2563eb",
			slug: "electronics-repair",
		},
		tagline: "Affordable phone, laptop, and accessory solutions.",
		cover_image:
			"https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
		average_rating: 3,
		review_count: 4,
		location_label: "Kenyatta Road, Nyeri",
		opening_time: "09:00",
		closing_time: "19:00",
		open_days: "Mon - Sun",
		delivery_available: true,
	},
	{
		id: 3,
		slug: "glow-house-salon",
		name: "Glow House Salon",
		description:
			"Professional beauty salon providing hairstyling, makeup, nail care, skincare, and premium grooming services.",
		featured: true,
		categories: {
			name: "Salon & Beauty",
			color: "#db2777",
			slug: "salon-beauty",
		},
		tagline: "Modern beauty care and professional styling.",
		cover_image:
			"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",
		average_rating: 4.8,
		review_count: 28,
		location_label: "Gakere Road, Nyeri",
		opening_time: "08:30",
		closing_time: "20:00",
		open_days: "Mon - Sun",
		delivery_available: false,
	},
	{
		id: 4,
		slug: "royal-touch-barbershop",
		name: "Royal Touch Barbershop",
		description:
			"Modern barbershop offering stylish haircuts, beard grooming, fades, and personalized men's grooming services.",
		featured: false,
		categories: {
			name: "Salon & Beauty",
			color: "#db2777",
			slug: "salon-beauty",
		},
		tagline: "Sharp cuts, clean fades, and premium grooming.",
		cover_image:
			"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
		average_rating: 4.5,
		review_count: 18,
		location_label: "Temple Road, Nyeri",
		opening_time: "09:00",
		closing_time: "21:00",
		open_days: "Tue - Sun",
		delivery_available: false,
	},
	{
		id: 5,
		slug: "green-basket-market",
		name: "Green Basket Market",
		description:
			"Neighborhood grocery store supplying fresh vegetables, fruits, beverages, snacks, and daily household essentials.",
		featured: true,
		categories: {
			name: "Grocery & Supermarket",
			color: "#16a34a",
			slug: "grocery-supermarket",
		},
		tagline: "Fresh groceries and daily essentials.",
		cover_image:
			"https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
		average_rating: 4.7,
		review_count: 42,
		location_label: "Othaya Road, Nyeri",
		opening_time: "07:00",
		closing_time: "22:00",
		open_days: "Mon - Sun",
		delivery_available: true,
	},
	{
		id: 6,
		slug: "family-choice-supermarket",
		name: "Family Choice Supermarket",
		description:
			"Convenient supermarket with affordable groceries, cleaning products, fresh produce, and packaged food items.",
		featured: false,
		categories: {
			name: "Grocery & Supermarket",
			color: "#16a34a",
			slug: "grocery-supermarket",
		},
		tagline: "Convenient shopping with affordable prices.",
		cover_image:
			"https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1200&auto=format&fit=crop",
		average_rating: 4.3,
		review_count: 21,
		location_label: "Mweiga Road, Nyeri",
		opening_time: "08:00",
		closing_time: "21:00",
		open_days: "Mon - Sat",
		delivery_available: true,
	},
	{
		id: 7,
		slug: "sparkle-laundry",
		name: "Sparkle Laundry",
		description:
			"Fast and dependable laundry service handling washing, drying, ironing, folding, and dry-cleaning solutions.",
		featured: true,
		categories: {
			name: "Laundry Services",
			color: "#0ea5e9",
			slug: "laundry",
		},
		tagline: "Fast, clean, and reliable laundry services.",
		cover_image:
			"https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200&auto=format&fit=crop",
		average_rating: 4.9,
		review_count: 33,
		location_label: "Kamakwa, Nyeri",
		opening_time: "07:30",
		closing_time: "19:00",
		open_days: "Mon - Sun",
		delivery_available: true,
	},
	{
		id: 8,
		slug: "quickwash-laundry",
		name: "QuickWash Laundry",
		description:
			"Affordable laundry and dry-cleaning business offering same-day washing, ironing, and fabric care services.",
		featured: false,
		categories: {
			name: "Laundry Services",
			color: "#0ea5e9",
			slug: "laundry",
		},
		tagline: "Affordable washing, ironing, and dry cleaning.",
		cover_image:
			"https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop",
		average_rating: 4.2,
		review_count: 15,
		location_label: "King'ong'o, Nyeri",
		opening_time: "08:00",
		closing_time: "18:00",
		open_days: "Mon - Sat",
		delivery_available: true,
	},
	{
		id: 9,
		slug: "codecraft-academy",
		name: "CodeCraft Academy",
		description:
			"Technology training center teaching programming, web development, digital literacy, and practical software skills.",
		featured: true,
		categories: {
			name: "Education & Training",
			color: "#7c3aed",
			slug: "education",
		},
		tagline: "Programming and digital skills training.",
		cover_image:
			"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
		average_rating: 5,
		review_count: 40,
		location_label: "Nyeri Town",
		opening_time: "08:00",
		closing_time: "17:00",
		open_days: "Mon - Fri",
		delivery_available: false,
	},
	{
		id: 10,
		slug: "future-stars-tuition",
		name: "Future Stars Tuition Centre",
		description:
			"Education center focused on tutoring, exam preparation, mentorship, and academic improvement for students.",
		featured: false,
		categories: {
			name: "Education & Training",
			color: "#7c3aed",
			slug: "education",
		},
		tagline: "Quality tutoring and exam preparation classes.",
		cover_image:
			"https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
		average_rating: 4.6,
		review_count: 24,
		location_label: "Ruring'u, Nyeri",
		opening_time: "09:00",
		closing_time: "16:00",
		open_days: "Mon - Sat",
		delivery_available: false,
	},
];

const dummyUserProfile = {
	id: 1,
	avatar_url: "https://www.loremfaces.net/128/id/1.jpg",
	full_name: "Thompson Thompson",
	role: "user",
};

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
	dummyBusinesses,
	dummyUserProfile,
	dummyFavorites,
	dummyCommunityPosts,
	TYPE_OPTIONS,
	TYPE_OPTION_COLORS,
};
