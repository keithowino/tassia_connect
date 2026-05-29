// import {
// 	UtensilsCrossed,
// 	Scissors,
// 	Wrench,
// 	Pill,
// 	Smartphone,
// 	ShoppingBasket,
// 	Wind,
// 	Stethoscope,
// 	Coffee,
// 	Banknote,
// 	Shirt,
// 	BookOpen,
// 	Store,
// } from "lucide-react";

// const ICON_MAP = {
// 	UtensilsCrossed,
// 	Scissors,
// 	Wrench,
// 	Pill,
// 	Smartphone,
// 	ShoppingBasket,
// 	Wind,
// 	Stethoscope,
// 	Coffee,
// 	Banknote,
// 	Shirt,
// 	BookOpen,
// 	Store,
// };

// export default function CategoryFilter({ categories, selected, onSelect }) {
// 	// Handle empty or undefined categories
// 	if (!categories || categories.length === 0) {
// 		return null;
// 	}

// 	return (
// 		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
// 			<button
// 				onClick={() => onSelect(null)}
// 				className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
// 					selected === null
// 						? "bg-orange-500 text-white shadow-sm"
// 						: "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
// 				}`}
// 				aria-label="Show all businesses"
// 			>
// 				<Store size={15} />
// 				All
// 			</button>
// 			{categories.map((cat) => {
// 				const Icon = ICON_MAP[cat.icon] || Store;
// 				const isSelected = selected === cat.slug;

// 				return (
// 					<button
// 						key={cat.id}
// 						onClick={() => onSelect(isSelected ? null : cat.slug)}
// 						className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
// 							isSelected
// 								? "text-white shadow-sm"
// 								: "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
// 						}`}
// 						style={
// 							isSelected
// 								? { backgroundColor: cat.color || "#f97316" }
// 								: {}
// 						}
// 						aria-label={`Filter by ${cat.name}`}
// 						aria-pressed={isSelected}
// 					>
// 						<Icon size={15} />
// 						<span className="whitespace-nowrap">{cat.name}</span>
// 					</button>
// 				);
// 			})}
// 		</div>
// 	);
// }

import {
	UtensilsCrossed,
	Scissors,
	Wrench,
	Pill,
	Smartphone,
	ShoppingBasket,
	Wind,
	Stethoscope,
	Coffee,
	Banknote,
	Shirt,
	BookOpen,
	Store,
	Pizza,
	Car,
	Home,
	GraduationCap,
	Briefcase,
} from "lucide-react";

// Expanded icon map with more categories
const ICON_MAP = {
	// Food & Dining
	UtensilsCrossed,
	Pizza,
	Coffee,

	// Beauty & Personal Care
	Scissors,

	// Home Services
	Wrench,
	Home,

	// Health
	Pill,
	Stethoscope,

	// Electronics
	Smartphone,

	// Shopping
	ShoppingBasket,
	Banknote,
	Shirt,

	// Other Services
	Wind, // Salon/Beauty
	BookOpen, // Education
	Store, // General store
	Car, // Automotive
	GraduationCap, // Education/Training
	Briefcase, // Professional Services

	// Default fallbacks
	Store, // Default icon
};

// Default colors for categories (can be customized per category)
const DEFAULT_COLORS = {
	restaurant: "#f97316",
	food: "#f97316",
	cafe: "#d97706",
	salon: "#ec4899",
	barber: "#ec4899",
	spa: "#8b5cf6",
	hardware: "#3b82f6",
	repair: "#3b82f6",
	pharmacy: "#10b981",
	clinic: "#10b981",
	electronics: "#6366f1",
	clothing: "#f43f5e",
	grocery: "#22c55e",
	supermarket: "#22c55e",
	education: "#8b5cf6",
	automotive: "#ef4444",
	default: "#6b7280",
};

/**
 * Get icon component by name
 * @param {string} iconName - Name of the icon from category data
 * @returns {React.ComponentType} Lucide icon component
 */
const getIconComponent = (iconName) => {
	if (!iconName) return Store;

	// Try to get the icon directly from ICON_MAP
	if (ICON_MAP[iconName]) {
		return ICON_MAP[iconName];
	}

	// Try to find a matching icon by case-insensitive comparison
	const matchingIcon = Object.keys(ICON_MAP).find(
		(key) => key.toLowerCase() === iconName.toLowerCase(),
	);

	return matchingIcon ? ICON_MAP[matchingIcon] : Store;
};

/**
 * Get color for category based on its slug/name
 * @param {string} slug - Category slug
 * @param {string} color - Custom color if provided
 * @returns {string} CSS color value
 */
const getCategoryColor = (slug, color) => {
	if (color) return color;

	// Check if we have a predefined color for this slug
	const matchingColor = Object.keys(DEFAULT_COLORS).find((key) =>
		slug?.toLowerCase().includes(key),
	);

	return matchingColor
		? DEFAULT_COLORS[matchingColor]
		: DEFAULT_COLORS.default;
};

export default function CategoryFilter({ categories, selected, onSelect }) {
	// Handle loading or empty states
	if (!categories) {
		return (
			<div className="flex gap-2 overflow-x-auto pb-2">
				<div className="animate-pulse">
					<div className="h-10 w-20 bg-gray-200 rounded-full"></div>
				</div>
			</div>
		);
	}

	if (categories.length === 0) {
		return (
			<div className="text-center py-4">
				<p className="text-gray-500 text-sm">No categories available</p>
			</div>
		);
	}

	// Handle click with proper event handling
	const handleCategoryClick = (slug) => {
		// If clicking the same category, deselect it (toggle off)
		if (selected === slug) {
			onSelect?.(null);
		} else {
			onSelect?.(slug);
		}
	};

	const handleAllClick = () => {
		onSelect?.(null);
	};

	return (
		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			{/* All Categories Button */}
			<button
				onClick={handleAllClick}
				className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
					selected === null
						? "bg-orange-500 text-white shadow-sm"
						: "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:bg-orange-50"
				}`}
				aria-label="Show all businesses"
			>
				<Store size={15} />
				<span className="whitespace-nowrap">All</span>
			</button>

			{/* Category Buttons */}
			{categories.map((cat) => {
				// Support both MongoDB _id and Firestore id
				const categoryId = cat._id || cat.id;
				const categoryName = cat.name || cat.category_name;
				const categorySlug = cat.slug || getCategorySlug(categoryName);
				const categoryIcon = cat.icon || cat.icon_name;
				const categoryColor =
					cat.color || getCategoryColor(categorySlug, cat.color);

				const Icon = getIconComponent(categoryIcon);
				const isSelected = selected === categorySlug;

				return (
					<button
						key={categoryId}
						onClick={() => handleCategoryClick(categorySlug)}
						className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
							isSelected
								? "text-white shadow-sm"
								: "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
						}`}
						style={
							isSelected ? { backgroundColor: categoryColor } : {}
						}
						aria-label={`Filter by ${categoryName}`}
						aria-pressed={isSelected}
					>
						<Icon size={15} />
						<span className="whitespace-nowrap">
							{categoryName}
						</span>
					</button>
				);
			})}
		</div>
	);
}

/**
 * Helper function to generate slug from name if not provided
 */
function getCategorySlug(name) {
	if (!name) return "";
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
