// Replaces shadcn Sheet
import React from "react";
import {
	X,
	MapPin,
	Clock,
	Store,
	Eye,
	Star,
	Phone,
	Mail,
	Calendar,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";

export default function DetailSheet({ open, onClose, business, onAction }) {
	if (!open || !business) return null;

	const getStatus = (biz) => {
		if (biz.isVerified) return "verified";
		if (biz.isActive) return "active";
		return "pending";
	};

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("en-KE", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<>
			<div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
			<div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
					<h2 className="text-lg font-bold text-gray-900 truncate">
						{business.businessName}
					</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="p-5 space-y-5">
					{/* Cover Image */}
					{business.coverImage && (
						<img
							src={business.coverImage}
							alt=""
							className="w-full h-40 rounded-xl object-cover"
						/>
					)}

					{/* Status Badges */}
					<div className="flex items-center gap-2">
						<StatusBadge status={getStatus(business)} />
						{business.delivery_available && (
							<span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize border bg-cyan-50 text-cyan-700 border-cyan-200">
								Delivery Available
							</span>
						)}
					</div>

					{/* Tagline */}
					{business.tagline && (
						<p className="text-sm italic text-gray-500">
							"{business.tagline}"
						</p>
					)}

					{/* Description */}
					<p className="text-sm text-gray-700 leading-relaxed">
						{business.description || "No description available."}
					</p>

					{/* Details Grid */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Category
							</p>
							<p className="font-medium text-gray-900 mt-0.5">
								{business.category || "—"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Views
							</p>
							<p className="font-medium text-gray-900 mt-0.5 flex items-center gap-1">
								<Eye className="w-3 h-3" />{" "}
								{business.viewCount || 0}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Rating
							</p>
							<p className="font-medium text-gray-900 mt-0.5">
								{business.averageRating
									? `${business.averageRating.toFixed(1)} ★ (${business.reviewCount || 0} reviews)`
									: "No reviews"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Location
							</p>
							<p className="font-medium text-gray-900 mt-0.5 flex items-center gap-1">
								<MapPin className="w-3 h-3" />{" "}
								{business.location?.address || "—"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Hours
							</p>
							<p className="font-medium text-gray-900 mt-0.5 flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{business.opening_time || "—"} -{" "}
								{business.closing_time || "—"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Open Days
							</p>
							<p className="font-medium text-gray-900 mt-0.5">
								{business.open_days?.join(", ") || "—"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Email
							</p>
							<p className="font-medium text-gray-900 mt-0.5 truncate flex items-center gap-1">
								<Mail className="w-3 h-3 shrink-0" />{" "}
								{business.email || "—"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Phone
							</p>
							<p className="font-medium text-gray-900 mt-0.5 flex items-center gap-1">
								<Phone className="w-3 h-3" />{" "}
								{business.phone || "—"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 font-medium">
								Created
							</p>
							<p className="font-medium text-gray-900 mt-0.5 flex items-center gap-1">
								<Calendar className="w-3 h-3" />{" "}
								{formatDate(business.createdAt)}
							</p>
						</div>
						{business.whatsapp && (
							<div>
								<p className="text-xs text-gray-500 font-medium">
									WhatsApp
								</p>
								<p className="font-medium text-gray-900 mt-0.5">
									{business.whatsapp}
								</p>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-4 border-t border-gray-100">
						{!business.isVerified && (
							<button
								onClick={() => onAction(business, "verify")}
								className="flex-1 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
							>
								Verify Business
							</button>
						)}
						{business.isActive ? (
							<button
								onClick={() => onAction(business, "suspend")}
								className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
							>
								Suspend Business
							</button>
						) : (
							<button
								onClick={() => onAction(business, "activate")}
								className="flex-1 bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
							>
								Activate Business
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
