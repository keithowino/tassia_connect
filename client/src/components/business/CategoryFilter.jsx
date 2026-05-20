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
} from "lucide-react";

const ICON_MAP = {
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
};

export default function CategoryFilter({ categories, selected, onSelect }) {
	// Handle empty or undefined categories
	if (!categories || categories.length === 0) {
		return null;
	}

	return (
		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			<button
				onClick={() => onSelect(null)}
				className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
					selected === null
						? "bg-orange-500 text-white shadow-sm"
						: "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
				}`}
				aria-label="Show all businesses"
			>
				<Store size={15} />
				All
			</button>
			{categories.map((cat) => {
				const Icon = ICON_MAP[cat.icon] || Store;
				const isSelected = selected === cat.slug;

				return (
					<button
						key={cat.id}
						onClick={() => onSelect(isSelected ? null : cat.slug)}
						className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
							isSelected
								? "text-white shadow-sm"
								: "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
						}`}
						style={
							isSelected
								? { backgroundColor: cat.color || "#f97316" }
								: {}
						}
						aria-label={`Filter by ${cat.name}`}
						aria-pressed={isSelected}
					>
						<Icon size={15} />
						<span className="whitespace-nowrap">{cat.name}</span>
					</button>
				);
			})}
		</div>
	);
}
