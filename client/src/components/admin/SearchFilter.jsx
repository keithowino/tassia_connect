import React from "react";
import { Search, X } from "lucide-react";

export default function SearchFilter({
	search,
	onSearchChange,
	filters = [],
	children,
}) {
	return (
		<div className="flex flex-col sm:flex-row gap-3 mb-4">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
				<input
					type="text"
					placeholder="Search by name or email..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
				/>
				{search && (
					<button
						onClick={() => onSearchChange("")}
						className="absolute right-3 top-1/2 -translate-y-1/2"
					>
						<X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
					</button>
				)}
			</div>
			{filters.map((filter) => (
				<select
					key={filter.key}
					value={filter.value}
					onChange={(e) => filter.onChange(e.target.value)}
					className="w-full sm:w-[160px] h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
				>
					<option value="all">{filter.allLabel || "All"}</option>
					{filter.options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			))}
			{children}
		</div>
	);
}
