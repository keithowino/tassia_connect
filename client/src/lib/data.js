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

const dummyBusinesses = [
	{
		id: 1,
		slug: "pickaxe-and-shovel",
		name: "Pickaxe & Shovel",
		description:
			"Reliable electronics repair shop offering phone fixing, laptop maintenance, accessories, and technical support services.",
		featured: true,
		view_count: 1240,
		floor_unit: "1st Floor, Shop B12",
		address: "Kimathi Street, Nyeri Town, Nyeri County",
		phone: "+254768290857",
		whatsapp: "+254768290857",
		email: "designsolutions1629@gmail.com",
		website: "https://pickaxe-and-shovel.vercel.app",
		min_order: 500,
		delivery_fee: 150,
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
		location_label: "Tassia Complex, Embakasi East",
		opening_time: "08:00",
		closing_time: "18:00",
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		delivery_available: true,
	},
	{
		id: 2,
		slug: "preemie-tech",
		name: "Preemie",
		description:
			"Affordable gadget repair and electronics store specializing in smartphones, laptops, chargers, and accessories.",
		featured: true,
		view_count: 860,
		floor_unit: "Ground Floor, Shop G04",
		address: "Kenyatta Road, Nyeri Town, Nyeri County",
		phone: "+254712345602",
		whatsapp: "+254712345602",
		email: "hello@preemietech.co.ke",
		website: "https://www.preemietech.co.ke",
		min_order: 300,
		delivery_fee: 100,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		delivery_available: true,
	},
	{
		id: 3,
		slug: "glow-house-salon",
		name: "Glow House Salon",
		description:
			"Professional beauty salon providing hairstyling, makeup, nail care, skincare, and premium grooming services.",
		featured: true,
		view_count: 2150,
		floor_unit: "2nd Floor, Room 204",
		address: "Gakere Road, Nyeri Town, Nyeri County",
		phone: "+254712345603",
		whatsapp: "+254712345603",
		email: "appointments@glowhouse.co.ke",
		website: "https://www.glowhouse.co.ke",
		min_order: 0,
		delivery_fee: 0,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		delivery_available: false,
	},
	{
		id: 4,
		slug: "royal-touch-barbershop",
		name: "Royal Touch Barbershop",
		description:
			"Modern barbershop offering stylish haircuts, beard grooming, fades, and personalized men's grooming services.",
		featured: false,
		view_count: 1325,
		floor_unit: "Ground Floor, Shop A08",
		address: "Temple Road, Nyeri Town, Nyeri County",
		phone: "+254712345604",
		whatsapp: "+254712345604",
		email: "bookings@royaltouchbarbershop.co.ke",
		website: "https://www.royaltouchbarbershop.co.ke",
		min_order: 0,
		delivery_fee: 0,
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
		open_days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		delivery_available: false,
	},
	{
		id: 5,
		slug: "green-basket-market",
		name: "Green Basket Market",
		description:
			"Neighborhood grocery store supplying fresh vegetables, fruits, beverages, snacks, and daily household essentials.",
		featured: true,
		view_count: 3010,
		floor_unit: "Ground Floor, Unit G15",
		address: "Othaya Road, Nyeri Town, Nyeri County",
		phone: "+254712345605",
		whatsapp: "+254712345605",
		email: "orders@greenbasketmarket.co.ke",
		website: "https://www.greenbasketmarket.co.ke",
		min_order: 1000,
		delivery_fee: 200,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		delivery_available: true,
	},
	{
		id: 6,
		slug: "family-choice-supermarket",
		name: "Family Choice Supermarket",
		description:
			"Convenient supermarket with affordable groceries, cleaning products, fresh produce, and packaged food items.",
		featured: false,
		view_count: 1890,
		floor_unit: "1st Floor, Unit F10",
		address: "Mweiga Road, Nyeri Town, Nyeri County",
		phone: "+254712345606",
		whatsapp: "+254712345606",
		email: "info@familychoice.co.ke",
		website: "https://www.familychoice.co.ke",
		min_order: 800,
		delivery_fee: 180,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		delivery_available: true,
	},
	{
		id: 7,
		slug: "sparkle-laundry",
		name: "Sparkle Laundry",
		description:
			"Fast and dependable laundry service handling washing, drying, ironing, folding, and dry-cleaning solutions.",
		featured: true,
		view_count: 980,
		floor_unit: "Basement Level, Unit B03",
		address: "Kamakwa, Nyeri County",
		phone: "+254712345607",
		whatsapp: "+254712345607",
		email: "care@sparklelaundry.co.ke",
		website: "https://www.sparklelaundry.co.ke",
		min_order: 400,
		delivery_fee: 120,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		delivery_available: true,
	},
	{
		id: 8,
		slug: "quickwash-laundry",
		name: "QuickWash Laundry",
		description:
			"Affordable laundry and dry-cleaning business offering same-day washing, ironing, and fabric care services.",
		featured: false,
		view_count: 720,
		floor_unit: "Ground Floor, Shop G11",
		address: "King'ong'o, Nyeri County",
		phone: "+254712345608",
		whatsapp: "+254712345608",
		email: "support@quickwashlaundry.co.ke",
		website: "https://www.quickwashlaundry.co.ke",
		min_order: 300,
		delivery_fee: 100,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		delivery_available: true,
	},
	{
		id: 9,
		slug: "codecraft-academy",
		name: "CodeCraft Academy",
		description:
			"Technology training center teaching programming, web development, digital literacy, and practical software skills.",
		featured: true,
		view_count: 2540,
		floor_unit: "3rd Floor, Room 301",
		address: "Nyeri Town CBD, Nyeri County",
		phone: "+254712345609",
		whatsapp: "+254712345609",
		email: "learn@codecraftacademy.co.ke",
		website: "https://www.codecraftacademy.co.ke",
		min_order: 0,
		delivery_fee: 0,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
		delivery_available: false,
	},
	{
		id: 10,
		slug: "future-stars-tuition",
		name: "Future Stars Tuition Centre",
		description:
			"Education center focused on tutoring, exam preparation, mentorship, and academic improvement for students.",
		featured: false,
		view_count: 1475,
		floor_unit: "2nd Floor, Room 210",
		address: "Ruring'u, Nyeri County",
		phone: "+254712345610",
		whatsapp: "+254712345610",
		email: "info@futurestarstuition.co.ke",
		website: "https://www.futurestarstuition.co.ke",
		min_order: 0,
		delivery_fee: 0,
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
		open_days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
	dummyBusinesses,
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
