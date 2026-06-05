import React from "react";
import { X } from "lucide-react";

export default function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
	destructive = false,
}) {
	if (!open) return null;

	return (
		<>
			<div
				className="fixed inset-0 bg-black/50 z-50"
				onClick={() => onOpenChange(false)}
			/>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 p-6">
				<button
					onClick={() => onOpenChange(false)}
					className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
				>
					<X className="w-4 h-4 text-gray-500" />
				</button>
				<h2 className="text-lg font-bold text-gray-900 mb-2">
					{title}
				</h2>
				<p className="text-sm text-gray-600 mb-6">{description}</p>
				<div className="flex gap-3">
					<button
						onClick={() => onOpenChange(false)}
						className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
							destructive
								? "bg-red-500 hover:bg-red-600"
								: "bg-orange-500 hover:bg-orange-600"
						}`}
					>
						Confirm
					</button>
				</div>
			</div>
		</>
	);
}
