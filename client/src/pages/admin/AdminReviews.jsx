import { useState, useEffect } from "react";
import { Star, Trash2, Flag, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { reviewAPI } from "../../lib/api";
import PageHeader from "../../components/admin/PageHeader";
import SearchFilter from "../../components/admin/SearchFilter";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminReviews() {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [ratingFilter, setRatingFilter] = useState("all");
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [refetchKey, setRefetchKey] = useState(0);

	const fetchReviews = async () => {
		setLoading(true);
		try {
			const response = await reviewAPI.getAll();
			setReviews(response.data || []);
		} catch (error) {
			console.error("Error fetching reviews:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReviews();
	}, [refetchKey]);

	const deleteReview = async (reviewId) => {
		try {
			await reviewAPI.delete(reviewId);
			setRefetchKey((prev) => prev + 1);
			setDeleteTarget(null);
		} catch (error) {
			console.error("Error deleting review:", error);
			alert(error.response?.data?.message || "Failed to delete review");
		}
	};

	const filtered = reviews.filter((r) => {
		const userName = r.userId?.fullName || "Anonymous";
		const businessName = r.businessId?.businessName || "";
		const matchSearch =
			!search ||
			userName.toLowerCase().includes(search.toLowerCase()) ||
			businessName.toLowerCase().includes(search.toLowerCase()) ||
			(r.comment &&
				r.comment.toLowerCase().includes(search.toLowerCase()));
		const matchRating =
			ratingFilter === "all" || String(r.rating) === ratingFilter;
		return matchSearch && matchRating;
	});

	const renderStars = (rating) => (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((s) => (
				<span
					key={s}
					className={s <= rating ? "text-amber-500" : "text-gray-300"}
				>
					★
				</span>
			))}
		</div>
	);

	const columns = [
		{
			key: "user",
			label: "Reviewer",
			render: (row) => (
				<div>
					<span className="text-sm font-medium text-gray-900">
						{row.userId?.fullName || "Anonymous"}
					</span>
					<p className="text-xs text-gray-500">
						{row.userId?.email || ""}
					</p>
				</div>
			),
		},
		{
			key: "business",
			label: "Business",
			render: (row) => (
				<div>
					<span className="text-sm font-medium text-gray-700">
						{row.businessId?.businessName || "—"}
					</span>
					<p className="text-xs text-gray-500">
						{row.businessId?.category || ""}
					</p>
				</div>
			),
		},
		{
			key: "rating",
			label: "Rating",
			render: (row) => renderStars(row.rating),
		},
		{
			key: "comment",
			label: "Comment",
			render: (row) => (
				<p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
					{row.comment || (
						<span className="text-gray-400 italic">No comment</span>
					)}
				</p>
			),
		},
		{
			key: "flags",
			label: "Flags",
			render: (row) => (
				<div className="flex gap-1">
					{row.reported && (
						<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
							<Flag className="w-3 h-3" /> Reported
						</span>
					)}
					{row.isVerified && (
						<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
							<CheckCircle className="w-3 h-3" /> Verified
						</span>
					)}
				</div>
			),
		},
		{
			key: "date",
			label: "Date",
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
				<button
					onClick={(e) => {
						e.stopPropagation();
						setDeleteTarget(row);
					}}
					className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
					title="Delete review"
				>
					<Trash2 className="w-3.5 h-3.5 text-red-500" />
				</button>
			),
		},
	];

	// Calculate average rating
	const averageRating =
		reviews.length > 0
			? (
					reviews.reduce((sum, r) => sum + r.rating, 0) /
					reviews.length
				).toFixed(1)
			: 0;

	// Rating distribution
	const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
		rating,
		count: reviews.filter((r) => r.rating === rating).length,
		percentage:
			reviews.length > 0
				? (reviews.filter((r) => r.rating === rating).length /
						reviews.length) *
					100
				: 0,
	}));

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-7xl mx-auto">
			<PageHeader
				title="Reviews"
				subtitle={`${reviews.length} total reviews · ${averageRating} ★ average`}
				onRefresh={() => setRefetchKey((prev) => prev + 1)}
			/>

			{/* Rating Distribution Summary */}
			{reviews.length > 0 && (
				<div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
					<h3 className="text-sm font-semibold text-gray-900 mb-3">
						Rating Distribution
					</h3>
					<div className="space-y-2">
						{ratingDistribution.map(
							({ rating, count, percentage }) => (
								<div
									key={rating}
									className="flex items-center gap-3"
								>
									<div className="flex items-center gap-1 w-16">
										<span className="text-sm font-medium text-gray-700">
											{rating}
										</span>
										<span className="text-amber-500">
											★
										</span>
									</div>
									<div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
										<div
											className="h-full bg-amber-400 rounded-full transition-all duration-500"
											style={{ width: `${percentage}%` }}
										/>
									</div>
									<div className="w-12 text-right">
										<span className="text-xs text-gray-500">
											{count}
										</span>
									</div>
								</div>
							),
						)}
					</div>
				</div>
			)}

			<SearchFilter
				search={search}
				onSearchChange={setSearch}
				filters={[
					{
						key: "rating",
						value: ratingFilter,
						onChange: setRatingFilter,
						placeholder: "Rating",
						allLabel: "All Ratings",
						options: [5, 4, 3, 2, 1].map((r) => ({
							value: String(r),
							label: `${r} Star${r !== 1 ? "s" : ""}`,
						})),
					},
				]}
			/>

			<DataTable
				columns={columns}
				data={filtered}
				emptyIcon={Star}
				emptyMessage="No reviews found"
			/>

			<ConfirmDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
				title="Delete Review?"
				description={`Are you sure you want to delete the review by ${deleteTarget?.userId?.fullName || "Anonymous"} for ${deleteTarget?.businessId?.businessName || "this business"}? This action cannot be undone.`}
				onConfirm={() => deleteReview(deleteTarget._id)}
				destructive
			/>
		</div>
	);
}
