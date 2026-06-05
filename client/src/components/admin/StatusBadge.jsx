// import React from "react";

// const STATUS_CONFIG = {
// 	// Order statuses
// 	pending: {
// 		label: "Pending",
// 		bg: "bg-yellow-100",
// 		text: "text-yellow-700",
// 		dot: "bg-yellow-500",
// 	},
// 	confirmed: {
// 		label: "Confirmed",
// 		bg: "bg-blue-100",
// 		text: "text-blue-700",
// 		dot: "bg-blue-500",
// 	},
// 	preparing: {
// 		label: "Preparing",
// 		bg: "bg-orange-100",
// 		text: "text-orange-700",
// 		dot: "bg-orange-500",
// 	},
// 	ready: {
// 		label: "Ready",
// 		bg: "bg-green-100",
// 		text: "text-green-700",
// 		dot: "bg-green-500",
// 	},
// 	delivered: {
// 		label: "Delivered",
// 		bg: "bg-gray-100",
// 		text: "text-gray-600",
// 		dot: "bg-gray-500",
// 	},
// 	cancelled: {
// 		label: "Cancelled",
// 		bg: "bg-red-100",
// 		text: "text-red-600",
// 		dot: "bg-red-500",
// 	},

// 	// Business statuses
// 	verified: {
// 		label: "Verified",
// 		bg: "bg-emerald-100",
// 		text: "text-emerald-700",
// 		dot: "bg-emerald-500",
// 	},
// 	active: {
// 		label: "Active",
// 		bg: "bg-blue-100",
// 		text: "text-blue-700",
// 		dot: "bg-blue-500",
// 	},
// 	unverified: {
// 		label: "Unverified",
// 		bg: "bg-yellow-100",
// 		text: "text-yellow-700",
// 		dot: "bg-yellow-500",
// 	},

// 	// Default
// 	default: {
// 		label: "Unknown",
// 		bg: "bg-gray-100",
// 		text: "text-gray-600",
// 		dot: "bg-gray-500",
// 	},
// };

// export default function StatusBadge({ status }) {
// 	const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;

// 	return (
// 		<span
// 			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
// 		>
// 			<span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
// 			{config.label}
// 		</span>
// 	);
// }

import React from "react";

const STATUS_STYLES = {
	// Business statuses
	approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
	verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
	active: "bg-blue-50 text-blue-700 border-blue-200",
	pending: "bg-amber-50 text-amber-700 border-amber-200",
	rejected: "bg-red-50 text-red-700 border-red-200",
	suspended: "bg-red-50 text-red-700 border-red-200",
	unverified: "bg-amber-50 text-amber-700 border-amber-200",

	// Order statuses
	confirmed: "bg-blue-50 text-blue-700 border-blue-200",
	preparing: "bg-violet-50 text-violet-700 border-violet-200",
	ready: "bg-cyan-50 text-cyan-700 border-cyan-200",
	delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
	cancelled: "bg-red-50 text-red-700 border-red-200",
	completed: "bg-gray-50 text-gray-700 border-gray-200",

	// Payment statuses
	paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
	failed: "bg-red-50 text-red-700 border-red-200",
	refunded: "bg-gray-50 text-gray-700 border-gray-200",

	// Generic
	true: "bg-emerald-50 text-emerald-700 border-emerald-200",
	false: "bg-red-50 text-red-700 border-red-200",

	// Roles
	admin: "bg-purple-50 text-purple-700 border-purple-200",
	business_owner: "bg-orange-50 text-orange-700 border-orange-200",
	user: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function StatusBadge({ status, className = "" }) {
	const key = String(status).toLowerCase();
	const style =
		STATUS_STYLES[key] || "bg-gray-50 text-gray-700 border-gray-200";
	const label = String(status).replace(/_/g, " ");

	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize border ${style} ${className}`}
		>
			{label}
		</span>
	);
}
