import { Link } from "react-router-dom";
import { MapPin, Star, Clock, Heart } from "lucide-react";
import { useData } from "../../lib/context/DataContext";

// Helper function to check if business is currently open
function isOpen(openingTime, closingTime, openDays) {
	if (!openingTime || !closingTime) return false;

	const now = new Date();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const today = days[now.getDay()];

	if (!openDays || !openDays.includes(today)) return false;

	const [oh, om] = openingTime.split(":").map(Number);
	const [ch, cm] = closingTime.split(":").map(Number);
	const nowMins = now.getHours() * 60 + now.getMinutes();

	return nowMins >= oh * 60 + om && nowMins < ch * 60 + cm;
}

// Helper function to get category slug from name
const getCategorySlug = (categoryName) => {
	if (!categoryName) return "default";
	return categoryName
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
};

export default function BusinessCard({
	business,
	isFavorited,
	onToggleFavorite,
}) {
	const { FALLBACK_IMAGES } = useData();

	// Get business data with MongoDB field names
	const businessId = business._id || business.id;
	const businessName = business.businessName || business.name;
	const businessSlug = business.slug;
	const category = business.category;
	const categorySlug = category ? getCategorySlug(category) : "default";
	const coverImage = business.coverImage || business.cover_image;
	const tagline = business.tagline;
	const locationLabel =
		business.location?.label || business.location_label || "Tassia Complex";
	const openingTime = business.opening_time;
	const closingTime = business.closing_time;
	const openDays = business.open_days;
	const deliveryAvailable = business.delivery_available;
	const isVerified = business.isVerified;
	const averageRating =
		business.averageRating || business.average_rating || 0;
	const reviewCount = business.reviewCount || business.review_count || 0;

	// Determine if business is open
	const open = isOpen(openingTime, closingTime, openDays);

	// Get the appropriate fallback image based on category
	const getFallbackImage = () => {
		if (categorySlug && FALLBACK_IMAGES[categorySlug]) {
			return FALLBACK_IMAGES[categorySlug];
		}
		return FALLBACK_IMAGES.default || FALLBACK_IMAGES.grocery;
	};

	// Set business image
	const businessImage = coverImage || getFallbackImage();

	const handleFavoriteClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (onToggleFavorite) {
			onToggleFavorite(businessId);
		}
	};

	return (
		<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
			<Link to={`/business/${businessSlug}`} className="block">
				{/* Image Section */}
				<div className="relative h-40 overflow-hidden">
					<img
						src={businessImage}
						alt={businessName}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						loading="lazy"
						onError={(e) => {
							e.target.src =
								FALLBACK_IMAGES.default ||
								FALLBACK_IMAGES.grocery;
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

					{/* Featured/Verified Badge */}
					{isVerified && (
						<span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
							Verified
						</span>
					)}

					{/* Open/Closed Badge */}
					<span
						className={`absolute top-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
							onToggleFavorite ? "right-10" : "right-2"
						} ${
							open
								? "bg-green-500 text-white"
								: "bg-gray-700 text-gray-200"
						}`}
					>
						{open ? "Open" : "Closed"}
					</span>

					{/* Favorite Button */}
					{onToggleFavorite && (
						<button
							onClick={handleFavoriteClick}
							className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors backdrop-blur-sm"
							aria-label={
								isFavorited
									? "Remove from favorites"
									: "Add to favorites"
							}
						>
							<Heart
								size={16}
								className={
									isFavorited
										? "fill-red-500 text-red-500"
										: "text-gray-500"
								}
							/>
						</button>
					)}

					{/* Category Badge */}
					{category && (
						<span
							className="absolute bottom-2 left-2 text-white text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm"
							style={{
								backgroundColor: "#f97316cc",
							}}
						>
							{category}
						</span>
					)}
				</div>
			</Link>

			{/* Business Info */}
			<Link to={`/business/${businessSlug}`} className="block p-3">
				<h3 className="font-bold text-gray-900 text-base leading-tight truncate group-hover:text-orange-500 transition-colors">
					{businessName}
				</h3>

				{tagline && (
					<p className="text-gray-500 text-xs mt-0.5 truncate">
						{tagline}
					</p>
				)}

				<div className="flex items-center justify-between mt-2">
					{/* Rating */}
					<div className="flex items-center gap-1">
						<Star
							size={13}
							className="fill-amber-400 text-amber-400"
						/>
						<span className="text-sm font-semibold text-gray-800">
							{averageRating > 0
								? averageRating.toFixed(1)
								: "New"}
						</span>
						{reviewCount > 0 && (
							<span className="text-xs text-gray-400">
								({reviewCount})
							</span>
						)}
					</div>

					{/* Location */}
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<MapPin size={11} />
						<span className="truncate max-w-[100px]">
							{locationLabel}
						</span>
					</div>
				</div>

				{/* Hours & Delivery */}
				<div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
					<Clock size={11} />
					<span>
						{openingTime || "08:00"} – {closingTime || "20:00"}
					</span>
					{deliveryAvailable && (
						<span className="ml-auto bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium text-[10px]">
							Delivery
						</span>
					)}
				</div>
			</Link>
		</div>
	);
}
