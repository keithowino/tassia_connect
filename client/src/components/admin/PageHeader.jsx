import React from "react";
import { RefreshCw } from "lucide-react";

export default function PageHeader({ title, subtitle, onRefresh, actions }) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
			<div>
				<h1 className="text-xl font-bold tracking-tight text-gray-900">
					{title}
				</h1>
				{subtitle && (
					<p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
				)}
			</div>
			<div className="flex items-center gap-2">
				{onRefresh && (
					<button
						onClick={onRefresh}
						className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
					>
						<RefreshCw className="w-3.5 h-3.5" />
						Refresh
					</button>
				)}
				{actions}
			</div>
		</div>
	);
}
