/**
|--------------------------------------------------


import {
  UtensilsCrossed, Scissors, Wrench, Pill, Smartphone, ShoppingBasket,
  Wind, Stethoscope, Coffee, Banknote, Shirt, BookOpen, Store
} from 'lucide-react';
import type { Category } from '../../lib/types';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  UtensilsCrossed, Scissors, Wrench, Pill, Smartphone, ShoppingBasket,
  Wind, Stethoscope, Coffee, Banknote, Shirt, BookOpen, Store,
};

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
          selected === null
            ? 'bg-orange-500 text-white shadow-sm'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
        }`}
      >
        <Store size={15} />
        All
      </button>
      {categories.map(cat => {
        const Icon = ICON_MAP[cat.icon] || Store;
        const isSelected = selected === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isSelected ? null : cat.slug)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
            style={isSelected ? { backgroundColor: cat.color } : {}}
          >
            <Icon size={15} />
            <span className="whitespace-nowrap">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}



|--------------------------------------------------
*/

import {
	Banknote,
	BookOpen,
	Coffee,
	Pill,
	Scissors,
	Shirt,
	ShoppingBasket,
	Smartphone,
	Stethoscope,
	Store,
	UtensilsCrossed,
	Wind,
	Wrench,
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

const CategoryFilter = ({ categories, selected, onSelect }) => {
	return (
		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			<button
				onClick={() => onSelect(null)}
				className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
					selected === null
						? "bg-orange-500 text-white shadow-sm"
						: "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
				}`}
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
						style={isSelected ? { backgroundColor: cat.color } : {}}
					>
						<Icon size={15} />
						<span className="whitespace-nowrap">{cat.name}</span>
					</button>
				);
			})}
		</div>
	);
};

export default CategoryFilter;
