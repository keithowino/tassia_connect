import React from "react";

export default function StatCard({
	icon: Icon,
	label,
	value,
	trend,
	trendUp,
	className = "",
	iconBg = "bg-orange-50",
	iconColor = "text-orange-500",
}) {
	return (
		<div
			className={`bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 ${className}`}
		>
			<div className="flex items-start justify-between">
				<div
					className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
				>
					<Icon className={`w-5 h-5 ${iconColor}`} />
				</div>
				{trend !== undefined && (
					<span
						className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
							trendUp
								? "bg-green-50 text-green-600"
								: "bg-red-50 text-red-600"
						}`}
					>
						{trendUp ? "+" : ""}
						{trend}%
					</span>
				)}
			</div>
			<p className="text-2xl font-bold mt-4 tracking-tight text-gray-900">
				{value}
			</p>
			<p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
		</div>
	);
}
