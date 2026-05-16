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
		pinned: false,
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
		pinned: true,
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
		pinned: true,
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

const dummyReviews = [
	{
		id: 1,
		business_id: 1,
		user_id: 1,
		rating: 5,
		comment:
			"Excellent repair service. My phone screen was replaced within a few hours and works perfectly.",
		profiles: {
			full_name: "Brian Mwangi",
		},
		created_at: "2026-05-10T09:30:00",
		owner_reply:
			"Thank you Brian! We’re glad you loved the service and appreciate your support.",
	},
	{
		id: 2,
		business_id: 2,
		user_id: 2,
		rating: 4,
		comment:
			"Affordable accessories and friendly staff. Delivery took slightly longer than expected.",
		profiles: {
			full_name: "Mercy Wanjiku",
		},
		created_at: "2026-05-09T14:10:00",
		owner_reply:
			"Thanks Mercy. We’re working on improving our delivery times.",
	},
	{
		id: 3,
		business_id: 3,
		user_id: 3,
		rating: 5,
		comment:
			"The hairstyling service was amazing. Professional staff and a very clean environment.",
		profiles: {
			full_name: "Sharon Njeri",
		},
		created_at: "2026-05-08T11:45:00",
		owner_reply:
			"Thank you Sharon! We look forward to seeing you again soon.",
	},
	{
		id: 4,
		business_id: 4,
		user_id: 4,
		rating: 4,
		comment:
			"Great fade and beard trim. The barbers are talented and welcoming.",
		profiles: {
			full_name: "Kevin Kariuki",
		},
		created_at: "2026-05-07T16:20:00",
		owner_reply: "Appreciate the review Kevin. Thank you for choosing us.",
	},
	{
		id: 5,
		business_id: 5,
		user_id: 5,
		rating: 5,
		comment:
			"Fresh vegetables and fair prices. Their home delivery service is very convenient.",
		profiles: {
			full_name: "Alice Wambui",
		},
		created_at: "2026-05-06T08:15:00",
		owner_reply:
			"Thank you Alice! We’re happy to keep serving you fresh produce.",
	},
	{
		id: 6,
		business_id: 6,
		user_id: 6,
		rating: 3,
		comment:
			"Good selection of groceries but the checkout queue was quite long.",
		profiles: {
			full_name: "Peter Njuguna",
		},
		created_at: "2026-05-05T18:00:00",
		owner_reply:
			"Thanks for the feedback Peter. We’ll work on improving customer flow.",
	},
	{
		id: 7,
		business_id: 7,
		user_id: 7,
		rating: 5,
		comment:
			"My clothes came back spotless and neatly folded. Highly recommend their service.",
		profiles: {
			full_name: "Faith Nyambura",
		},
		created_at: "2026-05-04T13:40:00",
		owner_reply:
			"Thank you Faith! Clean and reliable service is our priority.",
	},
	{
		id: 8,
		business_id: 8,
		user_id: 8,
		rating: 4,
		comment: "Affordable prices and same-day laundry service as promised.",
		profiles: {
			full_name: "Daniel Maina",
		},
		created_at: "2026-05-03T10:25:00",
		owner_reply: "Thanks Daniel! We appreciate your support and review.",
	},
	{
		id: 9,
		business_id: 9,
		user_id: 9,
		rating: 5,
		comment:
			"The programming classes are practical and beginner-friendly. I’ve learned a lot already.",
		profiles: {
			full_name: "Christine Wangui",
		},
		created_at: "2026-05-02T15:50:00",
		owner_reply:
			"We’re glad you’re enjoying the classes Christine. Keep learning!",
	},
	{
		id: 10,
		business_id: 10,
		user_id: 10,
		rating: 4,
		comment:
			"Very supportive tutors and well-organized revision classes for students.",
		profiles: {
			full_name: "Samuel Kimani",
		},
		created_at: "2026-05-01T12:00:00",
		owner_reply:
			"Thank you Samuel. We’re committed to helping students succeed.",
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
	dummyUserProfile,
	dummyFavorites,
	dummyCommunityPosts,
	TYPE_OPTIONS,
	TYPE_OPTION_COLORS,
	dummyProductsServices,
	dummyReviews,
	days,
	today,
};
