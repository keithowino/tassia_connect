import { Search, X } from "lucide-react";

const SearchBar = ({
	value,
	onChange,
	placeholder = "Search businesses, services...",
}) => {
	return (
		<div className="relative">
			<Search
				size={18}
				className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
			/>
			<input
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
			/>
			{value && (
				<button
					onClick={() => onChange("")}
					className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
};

export default SearchBar;
