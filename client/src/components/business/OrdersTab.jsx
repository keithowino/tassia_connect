import { useState, useMemo } from "react";
import { ClipboardList, TrendingUp } from "lucide-react";
import OrderCard from "./OrderCard";

const STATUS_FILTERS = [
	"All",
	"pending",
	"confirmed",
	"preparing",
	"ready",
	"delivered",
	"cancelled",
];

export default function OrdersTab({ orders, onUpdateStatus }) {
	const [filter, setFilter] = useState("All");

	const filtered = useMemo(
		() =>
			filter === "All"
				? orders
				: orders.filter((o) => o.status === filter),
		[orders, filter],
	);

	// Count badges per status
	const counts = useMemo(() => {
		const map = {};
		orders.forEach((o) => {
			map[o.status] = (map[o.status] || 0) + 1;
		});
		return map;
	}, [orders]);

	return (
		<div className="space-y-4">
			{/* Filter Pills */}
			<div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
				{STATUS_FILTERS.map((s) => {
					const active = filter === s;
					const count = s === "All" ? orders.length : counts[s];
					return (
						<button
							key={s}
							onClick={() => setFilter(s)}
							className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
								active
									? "bg-orange-500 text-white shadow-sm"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							<span className="capitalize">{s}</span>
							{count > 0 && (
								<span
									className={`text-xs rounded-full px-1 ${active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}
								>
									{count}
								</span>
							)}
						</button>
					);
				})}
			</div>

			{/* Orders List */}
			{filtered.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
					<TrendingUp
						size={36}
						className="text-gray-200 mx-auto mb-2"
					/>
					<p className="text-gray-400 text-sm">
						{filter === "All"
							? "No orders yet"
							: `No ${filter} orders`}
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{filtered.map((order) => (
						<OrderCard
							key={order._id}
							order={order}
							onUpdateStatus={onUpdateStatus}
						/>
					))}
				</div>
			)}
		</div>
	);
}
