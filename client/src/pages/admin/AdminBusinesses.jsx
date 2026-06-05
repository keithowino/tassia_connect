import { useState, useEffect } from "react";
import { Store, CheckCircle, XCircle, Eye, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { businessAPI, categoryAPI } from "../../lib/api";
import PageHeader from "../../components/admin/PageHeader";
import SearchFilter from "../../components/admin/SearchFilter";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import DetailSheet from "../../components/admin/DetailSheet";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminBusinesses() {
	const [businesses, setBusinesses] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [selectedBiz, setSelectedBiz] = useState(null);
	const [confirmAction, setConfirmAction] = useState(null);
	const [refetchKey, setRefetchKey] = useState(0);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [businessesRes, categoriesRes] = await Promise.all([
				businessAPI.getAll(),
				categoryAPI.getAll().catch(() => ({ data: [] })),
			]);
			setBusinesses(businessesRes.data || []);
			setCategories(categoriesRes.data || []);
		} catch (error) {
			console.error("Error fetching businesses:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [refetchKey]);

	const getStatus = (biz) => {
		if (biz.isVerified) return "verified";
		if (biz.isActive) return "active";
		return "pending";
	};

	const updateBusinessStatus = async (businessId, action) => {
		try {
			let updateData = {};
			if (action === "verify") {
				updateData = { isVerified: true, isActive: true };
			} else if (action === "suspend") {
				updateData = { isActive: false, isVerified: false };
			} else if (action === "activate") {
				updateData = { isActive: true };
			}

			await businessAPI.update(businessId, updateData);
			setRefetchKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error updating business:", error);
			alert(error.response?.data?.message || "Failed to update business");
		}
	};

	const filtered = businesses.filter((b) => {
		const matchSearch =
			!search ||
			b.businessName?.toLowerCase().includes(search.toLowerCase()) ||
			b.email?.toLowerCase().includes(search.toLowerCase());
		const status = getStatus(b);
		const matchStatus = statusFilter === "all" || status === statusFilter;
		const matchCategory =
			categoryFilter === "all" || b.category === categoryFilter;
		return matchSearch && matchStatus && matchCategory;
	});

	const uniqueCategories = [
		...new Set(businesses.map((b) => b.category).filter(Boolean)),
	];

	const handleAction = (biz, action) => {
		setConfirmAction({ biz, action });
	};

	const executeAction = () => {
		if (!confirmAction) return;
		const { biz, action } = confirmAction;
		updateBusinessStatus(biz._id, action);
		setConfirmAction(null);
		setSelectedBiz(null);
	};

	const columns = [
		{
			key: "business",
			label: "Business",
			render: (row) => (
				<div className="flex items-center gap-3">
					{row.logo ? (
						<img
							src={row.logo}
							alt=""
							className="w-9 h-9 rounded-xl object-cover"
						/>
					) : (
						<div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
							<Store className="w-4 h-4 text-orange-500" />
						</div>
					)}
					<div className="min-w-0">
						<p className="font-semibold text-sm text-gray-900 truncate">
							{row.businessName}
						</p>
						<p className="text-xs text-gray-500 truncate">
							{row.category || "Uncategorized"}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "location",
			label: "Location",
			render: (row) => (
				<div className="flex items-center gap-1.5 text-xs text-gray-500 max-w-[180px]">
					<MapPin className="w-3 h-3 shrink-0" />
					<span className="truncate">
						{row.location?.address || "—"}
					</span>
				</div>
			),
		},
		{
			key: "views",
			label: "Views",
			render: (row) => (
				<span className="text-sm font-medium text-gray-700">
					{row.viewCount || 0}
				</span>
			),
		},
		{
			key: "rating",
			label: "Rating",
			render: (row) => (
				<span className="text-sm text-gray-700">
					{row.averageRating
						? `${row.averageRating.toFixed(1)} ★`
						: "—"}
				</span>
			),
		},
		{
			key: "status",
			label: "Status",
			render: (row) => <StatusBadge status={getStatus(row)} />,
		},
		{
			key: "created",
			label: "Created",
			render: (row) => (
				<span className="text-xs text-gray-500">
					{row.createdAt
						? format(new Date(row.createdAt), "MMM d, yyyy")
						: "—"}
				</span>
			),
		},
		{
			key: "actions",
			label: "",
			cellClassName: "text-right",
			render: (row) => (
				<div className="flex items-center justify-end gap-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setSelectedBiz(row);
						}}
						className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
						title="View Details"
					>
						<Eye className="w-3.5 h-3.5 text-gray-500" />
					</button>
					{!row.isVerified && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleAction(row, "verify");
							}}
							className="p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
							title="Verify Business"
						>
							<CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
						</button>
					)}
					{row.isActive && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleAction(row, "suspend");
							}}
							className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
							title="Suspend Business"
						>
							<XCircle className="w-3.5 h-3.5 text-red-500" />
						</button>
					)}
				</div>
			),
		},
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-4 max-w-7xl mx-auto">
			<PageHeader
				title="Businesses"
				subtitle={`${businesses.length} total businesses`}
				onRefresh={() => setRefetchKey((prev) => prev + 1)}
			/>

			<SearchFilter
				search={search}
				onSearchChange={setSearch}
				filters={[
					{
						key: "status",
						value: statusFilter,
						onChange: setStatusFilter,
						placeholder: "Status",
						allLabel: "All Statuses",
						options: [
							{ value: "verified", label: "Verified" },
							{ value: "active", label: "Active" },
							{ value: "pending", label: "Pending" },
						],
					},
					{
						key: "category",
						value: categoryFilter,
						onChange: setCategoryFilter,
						placeholder: "Category",
						allLabel: "All Categories",
						options: uniqueCategories.map((c) => ({
							value: c,
							label: c,
						})),
					},
				]}
			/>

			<DataTable
				columns={columns}
				data={filtered}
				emptyIcon={Store}
				emptyMessage="No businesses found"
				onRowClick={setSelectedBiz}
			/>

			<DetailSheet
				open={!!selectedBiz}
				onClose={() => setSelectedBiz(null)}
				business={selectedBiz}
				onAction={handleAction}
			/>

			<ConfirmDialog
				open={!!confirmAction}
				onOpenChange={() => setConfirmAction(null)}
				title={
					confirmAction?.action === "suspend"
						? "Suspend Business?"
						: confirmAction?.action === "verify"
							? "Verify Business?"
							: "Activate Business?"
				}
				description={`Are you sure you want to ${confirmAction?.action} "${confirmAction?.biz?.businessName}"?`}
				onConfirm={executeAction}
				destructive={confirmAction?.action === "suspend"}
			/>
		</div>
	);
}
