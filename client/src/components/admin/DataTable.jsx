import React from "react";
import { Store } from "lucide-react";

export default function DataTable({
	columns,
	data,
	onRowClick,
	emptyIcon: EmptyIcon = Store,
	emptyMessage = "No data found",
}) {
	if (!data || data.length === 0) {
		return (
			<div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<EmptyIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
				<p className="text-sm text-gray-500">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-100">
						<tr>
							{columns.map((col) => (
								<th
									key={col.key}
									className={`text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 px-4 ${col.className || ""}`}
								>
									{col.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{data.map((row, i) => (
							<tr
								key={row._id || i}
								onClick={() => onRowClick?.(row)}
								className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
							>
								{columns.map((col) => (
									<td
										key={col.key}
										className={`py-3 px-4 text-sm ${col.cellClassName || ""}`}
									>
										{col.render
											? col.render(row)
											: row[col.key]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
