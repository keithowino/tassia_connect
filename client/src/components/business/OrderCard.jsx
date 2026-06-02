// import { useState } from "react";
// import {
// 	ChevronDown,
// 	ChevronUp,
// 	Phone,
// 	MessageCircle,
// 	MapPin,
// 	FileText,
// 	ShoppingBag,
// } from "lucide-react";

// const STATUS_CONFIG = {
// 	pending: {
// 		label: "Pending",
// 		emoji: "⏳",
// 		bg: "bg-yellow-100",
// 		text: "text-yellow-700",
// 		border: "border-yellow-200",
// 	},
// 	confirmed: {
// 		label: "Confirmed",
// 		emoji: "✅",
// 		bg: "bg-blue-100",
// 		text: "text-blue-700",
// 		border: "border-blue-200",
// 	},
// 	preparing: {
// 		label: "Preparing",
// 		emoji: "🔧",
// 		bg: "bg-orange-100",
// 		text: "text-orange-700",
// 		border: "border-orange-200",
// 	},
// 	ready: {
// 		label: "Ready",
// 		emoji: "📦",
// 		bg: "bg-green-100",
// 		text: "text-green-700",
// 		border: "border-green-200",
// 	},
// 	delivered: {
// 		label: "Delivered",
// 		emoji: "🚚",
// 		bg: "bg-gray-100",
// 		text: "text-gray-600",
// 		border: "border-gray-200",
// 	},
// 	cancelled: {
// 		label: "Cancelled",
// 		emoji: "❌",
// 		bg: "bg-red-100",
// 		text: "text-red-600",
// 		border: "border-red-200",
// 	},
// };

// const NEXT_ACTION = {
// 	pending: {
// 		label: "Confirm Order",
// 		next: "confirmed",
// 		color: "bg-blue-500 hover:bg-blue-600",
// 	},
// 	confirmed: {
// 		label: "Start Preparing",
// 		next: "preparing",
// 		color: "bg-orange-500 hover:bg-orange-600",
// 	},
// 	preparing: {
// 		label: "Mark Ready",
// 		next: "ready",
// 		color: "bg-green-500 hover:bg-green-600",
// 	},
// 	ready: {
// 		label: "Mark Delivered",
// 		next: "delivered",
// 		color: "bg-purple-500 hover:bg-purple-600",
// 	},
// };

// export default function OrderCard({ order, onUpdateStatus }) {
// 	const [expanded, setExpanded] = useState(false);

// 	const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
// 	const nextAction = NEXT_ACTION[order.status];
// 	const customerName = order.userId?.fullName || "Customer";
// 	const customerPhone = order.userId?.phoneNumber;
// 	const orderRef = order.orderNumber || order._id?.slice(0, 8).toUpperCase();
// 	const itemCount =
// 		order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;

// 	return (
// 		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
// 			{/* Compact Header Row */}
// 			<button
// 				onClick={() => setExpanded((v) => !v)}
// 				className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
// 			>
// 				{/* Status dot */}
// 				<span
// 					className={`w-2 h-2 rounded-full shrink-0 ${status.bg.replace("bg-", "bg-").replace("100", "500")}`}
// 				/>

// 				{/* Order ref + time */}
// 				<div className="min-w-0 flex-1">
// 					<div className="flex items-center gap-2 flex-wrap">
// 						<span className="font-mono text-xs font-semibold text-gray-700">
// 							#{orderRef}
// 						</span>
// 						<span
// 							className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}
// 						>
// 							{status.emoji} {status.label}
// 						</span>
// 					</div>
// 					<div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
// 						<span>{customerName}</span>
// 						<span>·</span>
// 						<span>
// 							{itemCount} item{itemCount !== 1 ? "s" : ""}
// 						</span>
// 						{order.createdAt && (
// 							<>
// 								<span>·</span>
// 								<span>
// 									{new Date(
// 										order.createdAt,
// 									).toLocaleTimeString("en-KE", {
// 										hour: "2-digit",
// 										minute: "2-digit",
// 									})}
// 								</span>
// 							</>
// 						)}
// 					</div>
// 				</div>

// 				{/* Total */}
// 				<div className="text-right shrink-0">
// 					<p className="font-bold text-gray-900 text-sm">
// 						KES {order.total?.toLocaleString() || 0}
// 					</p>
// 				</div>

// 				{/* Expand chevron */}
// 				<div className="text-gray-400 shrink-0">
// 					{expanded ? (
// 						<ChevronUp size={16} />
// 					) : (
// 						<ChevronDown size={16} />
// 					)}
// 				</div>
// 			</button>

// 			{/* Expanded Details */}
// 			{expanded && (
// 				<div className="border-t border-gray-100">
// 					{/* Customer Info */}
// 					<div className="px-4 py-3 border-b border-gray-100">
// 						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
// 							Customer
// 						</p>
// 						<div className="flex items-center justify-between">
// 							<div>
// 								<p className="text-sm font-medium text-gray-800">
// 									{customerName}
// 								</p>
// 								{customerPhone && (
// 									<p className="text-xs text-gray-500 mt-0.5">
// 										{customerPhone}
// 									</p>
// 								)}
// 							</div>
// 							{customerPhone && (
// 								<div className="flex gap-2">
// 									<a
// 										href={`tel:${customerPhone}`}
// 										onClick={(e) => e.stopPropagation()}
// 										className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
// 									>
// 										<Phone size={14} />
// 									</a>
// 									<a
// 										href={`https://wa.me/${customerPhone.replace(/\D/g, "")}`}
// 										target="_blank"
// 										rel="noopener noreferrer"
// 										onClick={(e) => e.stopPropagation()}
// 										className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
// 									>
// 										<MessageCircle size={14} />
// 									</a>
// 								</div>
// 							)}
// 						</div>

// 						{order.deliveryAddress?.address && (
// 							<div className="flex items-start gap-1.5 mt-2 text-xs text-gray-500">
// 								<MapPin
// 									size={12}
// 									className="shrink-0 mt-0.5 text-gray-400"
// 								/>
// 								<span>
// 									{order.deliveryAddress.address}
// 									{order.deliveryAddress.floorUnit &&
// 										`, ${order.deliveryAddress.floorUnit}`}
// 								</span>
// 							</div>
// 						)}
// 						{order.specialInstructions && (
// 							<div className="flex items-start gap-1.5 mt-1.5 text-xs text-gray-500">
// 								<FileText
// 									size={12}
// 									className="shrink-0 mt-0.5 text-gray-400"
// 								/>
// 								<span className="italic">
// 									"{order.specialInstructions}"
// 								</span>
// 							</div>
// 						)}
// 					</div>

// 					{/* Order Items */}
// 					<div className="px-4 py-3 border-b border-gray-100">
// 						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
// 							Items
// 						</p>
// 						<div className="space-y-1.5">
// 							{order.items?.map((item, idx) => (
// 								<div
// 									key={idx}
// 									className="flex items-center justify-between text-sm"
// 								>
// 									<span className="text-gray-700">
// 										<span className="text-gray-400 text-xs mr-1">
// 											×{item.quantity}
// 										</span>
// 										{item.name}
// 									</span>
// 									<span className="font-medium text-gray-800">
// 										KES{" "}
// 										{(
// 											item.price * item.quantity
// 										).toLocaleString()}
// 									</span>
// 								</div>
// 							))}
// 						</div>
// 					</div>

// 					{/* Financial Summary */}
// 					<div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
// 						<div className="space-y-1 text-sm">
// 							{[
// 								{ label: "Subtotal", value: order.subtotal },
// 								{ label: "Delivery", value: order.deliveryFee },
// 								{ label: "Tax (16%)", value: order.tax },
// 							].map(({ label, value }) => (
// 								<div
// 									key={label}
// 									className="flex justify-between text-gray-500"
// 								>
// 									<span>{label}</span>
// 									<span>
// 										KES {(value || 0).toLocaleString()}
// 									</span>
// 								</div>
// 							))}
// 							<div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-200 mt-1">
// 								<span>Total</span>
// 								<span className="text-orange-600">
// 									KES {(order.total || 0).toLocaleString()}
// 								</span>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Actions */}
// 					{!["delivered", "cancelled"].includes(order.status) && (
// 						<div className="px-4 py-3 flex gap-2">
// 							{nextAction && (
// 								<button
// 									onClick={() =>
// 										onUpdateStatus(
// 											order._id,
// 											nextAction.next,
// 										)
// 									}
// 									className={`flex-1 ${nextAction.color} text-white py-2.5 rounded-xl text-sm font-semibold transition-colors`}
// 								>
// 									{nextAction.label}
// 								</button>
// 							)}
// 							<button
// 								onClick={() => {
// 									if (confirm("Cancel this order?"))
// 										onUpdateStatus(order._id, "cancelled");
// 								}}
// 								className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
// 							>
// 								Cancel
// 							</button>
// 						</div>
// 					)}
// 				</div>
// 			)}
// 		</div>
// 	);
// }

import { useState } from "react";
import {
	ChevronDown,
	ChevronUp,
	Phone,
	MessageCircle,
	MapPin,
	FileText,
	ShoppingBag,
	Package,
} from "lucide-react";

const STATUS_CONFIG = {
	pending: {
		label: "Pending",
		emoji: "⏳",
		bg: "bg-yellow-100",
		text: "text-yellow-700",
		border: "border-yellow-200",
	},
	confirmed: {
		label: "Confirmed",
		emoji: "✅",
		bg: "bg-blue-100",
		text: "text-blue-700",
		border: "border-blue-200",
	},
	preparing: {
		label: "Preparing",
		emoji: "🔧",
		bg: "bg-orange-100",
		text: "text-orange-700",
		border: "border-orange-200",
	},
	ready: {
		label: "Ready",
		emoji: "📦",
		bg: "bg-green-100",
		text: "text-green-700",
		border: "border-green-200",
	},
	delivered: {
		label: "Delivered",
		emoji: "🚚",
		bg: "bg-gray-100",
		text: "text-gray-600",
		border: "border-gray-200",
	},
	cancelled: {
		label: "Cancelled",
		emoji: "❌",
		bg: "bg-red-100",
		text: "text-red-600",
		border: "border-red-200",
	},
};

const NEXT_ACTION = {
	pending: {
		label: "Confirm Order",
		next: "confirmed",
		color: "bg-blue-500 hover:bg-blue-600",
	},
	confirmed: {
		label: "Start Preparing",
		next: "preparing",
		color: "bg-orange-500 hover:bg-orange-600",
	},
	preparing: {
		label: "Mark Ready",
		next: "ready",
		color: "bg-green-500 hover:bg-green-600",
	},
	ready: {
		label: "Mark Delivered",
		next: "delivered",
		color: "bg-purple-500 hover:bg-purple-600",
	},
};

export default function OrderCard({ order, onUpdateStatus }) {
	const [expanded, setExpanded] = useState(false);

	const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
	const nextAction = NEXT_ACTION[order.status];

	// Safe data extraction with fallbacks
	const customerName =
		order.userId?.fullName || order.customer?.name || "Customer";
	const customerPhone = order.userId?.phoneNumber || order.customer?.phone;
	const orderRef = order.orderNumber || order._id?.slice(0, 8).toUpperCase();
	const itemCount =
		order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;

	// Check if order type is delivery
	const isDelivery =
		order.deliveryAddress?.address ||
		order.deliveryAddress?.type === "delivery";
	const deliveryAddress =
		order.deliveryAddress?.address || order.deliveryAddress;
	const floorUnit =
		order.deliveryAddress?.floorUnit || order.deliveryAddress?.floor_unit;

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
			{/* Compact Header Row */}
			<button
				onClick={() => setExpanded((v) => !v)}
				className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
			>
				{/* Status dot */}
				<span
					className={`w-2 h-2 rounded-full shrink-0 ${status.bg.replace("bg-", "bg-").replace("100", "500")}`}
				/>

				{/* Order ref + time */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="font-mono text-xs font-semibold text-gray-700">
							#{orderRef}
						</span>
						<span
							className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}
						>
							{status.emoji} {status.label}
						</span>
						{/* Order Type Badge */}
						<span
							className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDelivery ? "bg-purple-100 text-purple-600" : "bg-teal-100 text-teal-600"}`}
						>
							{isDelivery ? "🚚 Delivery" : "📦 Pickup"}
						</span>
					</div>
					<div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
						<span>{customerName}</span>
						<span>·</span>
						<span>
							{itemCount} item{itemCount !== 1 ? "s" : ""}
						</span>
						{order.createdAt && (
							<>
								<span>·</span>
								<span>
									{new Date(
										order.createdAt,
									).toLocaleTimeString("en-KE", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</>
						)}
					</div>
				</div>

				{/* Total */}
				<div className="text-right shrink-0">
					<p className="font-bold text-gray-900 text-sm">
						KES {order.total?.toLocaleString() || 0}
					</p>
				</div>

				{/* Expand chevron */}
				<div className="text-gray-400 shrink-0">
					{expanded ? (
						<ChevronUp size={16} />
					) : (
						<ChevronDown size={16} />
					)}
				</div>
			</button>

			{/* Expanded Details */}
			{expanded && (
				<div className="border-t border-gray-100">
					{/* Customer Info */}
					<div className="px-4 py-3 border-b border-gray-100">
						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
							Customer
						</p>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-800">
									{customerName}
								</p>
								{customerPhone && (
									<p className="text-xs text-gray-500 mt-0.5">
										{customerPhone}
									</p>
								)}
							</div>
							{customerPhone && (
								<div className="flex gap-2">
									<a
										href={`tel:${customerPhone}`}
										onClick={(e) => e.stopPropagation()}
										className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
										aria-label="Call customer"
									>
										<Phone size={14} />
									</a>
									<a
										href={`https://wa.me/${customerPhone.replace(/\D/g, "")}`}
										target="_blank"
										rel="noopener noreferrer"
										onClick={(e) => e.stopPropagation()}
										className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
										aria-label="WhatsApp customer"
									>
										<MessageCircle size={14} />
									</a>
								</div>
							)}
						</div>

						{/* Delivery Address - Only show for delivery orders */}
						{isDelivery && deliveryAddress && (
							<div className="flex items-start gap-1.5 mt-2 text-xs text-gray-500">
								<MapPin
									size={12}
									className="shrink-0 mt-0.5 text-gray-400"
								/>
								<span>
									{typeof deliveryAddress === "string"
										? deliveryAddress
										: deliveryAddress.address}
									{floorUnit && `, ${floorUnit}`}
								</span>
							</div>
						)}

						{/* Special Instructions */}
						{order.specialInstructions && (
							<div className="flex items-start gap-1.5 mt-2 text-xs text-gray-500">
								<FileText
									size={12}
									className="shrink-0 mt-0.5 text-gray-400"
								/>
								<span className="italic">
									"{order.specialInstructions}"
								</span>
							</div>
						)}
					</div>

					{/* Order Items */}
					<div className="px-4 py-3 border-b border-gray-100">
						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
							Items
						</p>
						<div className="space-y-1.5">
							{order.items?.map((item, idx) => (
								<div
									key={idx}
									className="flex items-center justify-between text-sm"
								>
									<span className="text-gray-700">
										<span className="text-gray-400 text-xs mr-1">
											×{item.quantity}
										</span>
										{item.name}
									</span>
									<span className="font-medium text-gray-800">
										KES{" "}
										{(
											item.price * item.quantity
										).toLocaleString()}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Financial Summary */}
					<div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
						<div className="space-y-1 text-sm">
							<div className="flex justify-between text-gray-500">
								<span>Subtotal</span>
								<span>
									KES {(order.subtotal || 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-gray-500">
								<span>Delivery Fee</span>
								<span>
									KES{" "}
									{(order.deliveryFee || 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-gray-500">
								<span>Tax (16% VAT)</span>
								<span>
									KES {(order.tax || 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-200 mt-1">
								<span>Total</span>
								<span className="text-orange-600">
									KES {(order.total || 0).toLocaleString()}
								</span>
							</div>
						</div>
					</div>

					{/* Actions */}
					{!["delivered", "cancelled"].includes(order.status) && (
						<div className="px-4 py-3 flex gap-2">
							{nextAction && (
								<button
									onClick={() =>
										onUpdateStatus(
											order._id,
											nextAction.next,
										)
									}
									className={`flex-1 ${nextAction.color} text-white py-2.5 rounded-xl text-sm font-semibold transition-colors`}
								>
									{nextAction.label}
								</button>
							)}
							<button
								onClick={() => {
									if (
										confirm(
											"Are you sure you want to cancel this order?",
										)
									)
										onUpdateStatus(order._id, "cancelled");
								}}
								className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
							>
								Cancel Order
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
