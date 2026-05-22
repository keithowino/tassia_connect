import { Link } from "react-router-dom";
import { MapPin, Star, Clock, Heart } from "lucide-react";
import { useData } from "../../lib/context/DataContext";

function isOpen(opening, closing, openDays) {
	const now = new Date();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const today = days[now.getDay()];

	if (!openDays || !openDays.includes(today)) return false;

	const [oh, om] = opening.split(":").map(Number);
	const [ch, cm] = closing.split(":").map(Number);
	const nowMins = now.getHours() * 60 + now.getMinutes();

	return nowMins >= oh * 60 + om && nowMins < ch * 60 + cm;
}

export default function BusinessCard({
	business,
	isFavorited,
	onToggleFavorite,
}) {
	const { FALLBACK_IMAGES } = useData();
	const slug = business.categories?.slug;
	const image =
		business.cover_image ||
		(slug && FALLBACK_IMAGES[slug]) ||
		FALLBACK_IMAGES["grocery"];
	const open = isOpen(
		business.opening_time,
		business.closing_time,
		business.open_days,
	);

	// Handle rating display
	const averageRating = business.average_rating || 0;
	const reviewCount = business.review_count || 0;

	return (
		<div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
			<Link to={`/business/${business.slug}`} className="block">
				<div className="relative h-40 overflow-hidden">
					<img
						src={image}
						alt={business.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						loading="lazy"
						onError={(e) => {
							// Fallback if image fails to load
							e.target.src = FALLBACK_IMAGES["grocery"];
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
					{business.featured && (
						<span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
							Featured
						</span>
					)}
					<span
						className={`absolute top-2 text-xs font-semibold px-2 py-0.5 rounded-full ${onToggleFavorite ? "right-10" : "right-2"} ${open ? "bg-green-500 text-white" : "bg-gray-700 text-gray-200"}`}
					>
						{open ? "Open" : "Closed"}
					</span>
					{onToggleFavorite && (
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onToggleFavorite(business.id);
							}}
							className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors"
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
					{business.categories && (
						<span
							className="absolute bottom-2 left-2 text-white text-xs font-medium px-2 py-0.5 rounded-full"
							style={{
								backgroundColor:
									(business.categories.color || "#f97316") +
									"cc",
							}}
						>
							{business.categories.name}
						</span>
					)}
				</div>
			</Link>
			<Link to={`/business/${business.slug}`} className="block p-3">
				<h3 className="font-bold text-gray-900 text-base leading-tight truncate group-hover:text-orange-500 transition-colors">
					{business.name}
				</h3>
				{business.tagline && (
					<p className="text-gray-500 text-xs mt-0.5 truncate">
						{business.tagline}
					</p>
				)}
				<div className="flex items-center justify-between mt-2">
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
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<MapPin size={11} />
						<span className="truncate max-w-[100px]">
							{business.location_label || "Tassia Complex"}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
					<Clock size={11} />
					<span>
						{business.opening_time || "08:00"} –{" "}
						{business.closing_time || "20:00"}
					</span>
					{business.delivery_available && (
						<span className="ml-auto bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium text-[10px]">
							Delivery
						</span>
					)}
				</div>
			</Link>
		</div>
	);
}
