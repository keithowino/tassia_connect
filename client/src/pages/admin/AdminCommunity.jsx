import { useState, useEffect } from "react";
import { MessageSquare, Pin, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { communityAPI } from "../../lib/api";
import PageHeader from "../../components/admin/PageHeader";
import SearchFilter from "../../components/admin/SearchFilter";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const POST_TYPES = ["general", "announcement", "deal", "news", "wanted"];

export default function AdminCommunity() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [selectedPost, setSelectedPost] = useState(null);
	const [refetchKey, setRefetchKey] = useState(0);

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const response = await communityAPI.getAll(1, 200);
			// Handle nested response structure
			const postsData = response.data?.posts || response.data || [];
			setPosts(postsData);
		} catch (error) {
			console.error("Error fetching community posts:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [refetchKey]);

	const togglePin = async (post) => {
		try {
			await communityAPI.togglePin(post._id);
			setRefetchKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error toggling pin:", error);
			alert(error.response?.data?.message || "Failed to update post");
		}
	};

	const deletePost = async (postId) => {
		try {
			await communityAPI.delete(postId);
			setRefetchKey((prev) => prev + 1);
			setDeleteTarget(null);
		} catch (error) {
			console.error("Error deleting post:", error);
			alert(error.response?.data?.message || "Failed to delete post");
		}
	};

	const filtered = posts.filter((p) => {
		const matchSearch =
			!search ||
			p.title?.toLowerCase().includes(search.toLowerCase()) ||
			p.content?.toLowerCase().includes(search.toLowerCase());
		const matchType = typeFilter === "all" || p.type === typeFilter;
		return matchSearch && matchType;
	});

	const typeStyles = {
		announcement: "bg-blue-50 text-blue-700 border-blue-200",
		deal: "bg-green-50 text-green-700 border-green-200",
		news: "bg-orange-50 text-orange-700 border-orange-200",
		wanted: "bg-red-50 text-red-700 border-red-200",
		general: "bg-gray-50 text-gray-700 border-gray-200",
	};

	// Format relative time
	const formatRelativeTime = (dateString) => {
		if (!dateString) return "—";
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins} min ago`;
		if (diffHours < 24)
			return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
		if (diffDays < 7)
			return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
		return format(date, "MMM d, yyyy");
	};

	const columns = [
		{
			key: "title",
			label: "Title",
			render: (row) => (
				<div className="flex items-center gap-2">
					{row.pinned && (
						<Pin className="w-3 h-3 text-orange-500 shrink-0" />
					)}
					<span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
						{row.title}
					</span>
				</div>
			),
		},
		{
			key: "type",
			label: "Type",
			render: (row) => (
				<span
					className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize border ${typeStyles[row.type] || typeStyles.general}`}
				>
					{row.type || "general"}
				</span>
			),
		},
		{
			key: "author",
			label: "Author",
			render: (row) => (
				<div>
					<span className="text-sm text-gray-700">
						{row.authorId?.fullName ||
							row.authorName ||
							"Anonymous"}
					</span>
					<p className="text-xs text-gray-500">
						{row.authorId?.email || ""}
					</p>
				</div>
			),
		},
		{
			key: "content",
			label: "Preview",
			render: (row) => (
				<p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
					{row.content || "—"}
				</p>
			),
		},
		{
			key: "engagement",
			label: "Engagement",
			render: (row) => (
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-500">
						{row.likes?.length || 0} ❤️
					</span>
					<span className="text-xs text-gray-500">
						{row.comments?.length || 0} 💬
					</span>
				</div>
			),
		},
		{
			key: "date",
			label: "Date",
			render: (row) => (
				<div>
					<span className="text-xs text-gray-500">
						{formatRelativeTime(row.createdAt)}
					</span>
					<p className="text-[10px] text-gray-400 mt-0.5">
						{row.createdAt
							? format(new Date(row.createdAt), "MMM d, yyyy")
							: "—"}
					</p>
				</div>
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
							setSelectedPost(row);
						}}
						className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
						title="View details"
					>
						<Eye className="w-3.5 h-3.5 text-gray-500" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							togglePin(row);
						}}
						className={`p-1.5 rounded-lg transition-colors ${
							row.pinned
								? "text-orange-500 hover:bg-orange-50"
								: "text-gray-400 hover:bg-gray-100"
						}`}
						title={row.pinned ? "Unpin post" : "Pin post"}
					>
						<Pin className="w-3.5 h-3.5" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setDeleteTarget(row);
						}}
						className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
						title="Delete post"
					>
						<Trash2 className="w-3.5 h-3.5 text-red-500" />
					</button>
				</div>
			),
		},
	];

	// Post Detail Modal Component
	const PostDetailModal = ({ post, onClose }) => {
		if (!post) return null;

		return (
			<>
				<div
					className="fixed inset-0 bg-black/50 z-50"
					onClick={onClose}
				/>
				<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 max-h-[80vh] overflow-y-auto">
					<div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
						<h3 className="text-lg font-bold text-gray-900 truncate">
							{post.title}
						</h3>
						<button
							onClick={onClose}
							className="p-1 rounded-lg hover:bg-gray-100"
						>
							✕
						</button>
					</div>
					<div className="p-5 space-y-4">
						{/* Post Type Badge */}
						<div className="flex items-center justify-between">
							<span
								className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize border ${typeStyles[post.type] || typeStyles.general}`}
							>
								{post.type || "general"}
							</span>
							{post.pinned && (
								<span className="inline-flex items-center gap-1 text-xs text-orange-600">
									<Pin className="w-3 h-3" /> Pinned
								</span>
							)}
						</div>

						{/* Author Info */}
						<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
							<div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
								<span className="text-orange-600 font-bold text-sm">
									{(
										post.authorId?.fullName?.[0] ||
										post.authorName?.[0] ||
										"A"
									).toUpperCase()}
								</span>
							</div>
							<div>
								<p className="font-medium text-gray-900">
									{post.authorId?.fullName ||
										post.authorName ||
										"Anonymous"}
								</p>
								<p className="text-xs text-gray-500">
									Posted {formatRelativeTime(post.createdAt)}
								</p>
							</div>
						</div>

						{/* Content */}
						<div>
							<p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
								{post.content}
							</p>
						</div>

						{/* Engagement Stats */}
						<div className="flex items-center gap-4 pt-3 border-t border-gray-100">
							<div className="flex items-center gap-1 text-sm text-gray-600">
								<span>❤️</span> {post.likes?.length || 0} likes
							</div>
							<div className="flex items-center gap-1 text-sm text-gray-600">
								<span>💬</span> {post.comments?.length || 0}{" "}
								comments
							</div>
						</div>

						{/* Comments Section */}
						{post.comments && post.comments.length > 0 && (
							<div className="pt-3 border-t border-gray-100">
								<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
									Comments
								</p>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{post.comments.map((comment, idx) => (
										<div
											key={idx}
											className="bg-gray-50 rounded-lg p-2"
										>
											<p className="text-xs font-medium text-gray-700">
												{comment.userId?.fullName ||
													"User"}
											</p>
											<p className="text-xs text-gray-600 mt-0.5">
												{comment.content}
											</p>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</>
		);
	};

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
				title="Community Posts"
				subtitle={`${posts.length} total posts · ${posts.filter((p) => p.pinned).length} pinned`}
				onRefresh={() => setRefetchKey((prev) => prev + 1)}
			/>

			<SearchFilter
				search={search}
				onSearchChange={setSearch}
				filters={[
					{
						key: "type",
						value: typeFilter,
						onChange: setTypeFilter,
						placeholder: "Type",
						allLabel: "All Types",
						options: POST_TYPES.map((t) => ({
							value: t,
							label: t.charAt(0).toUpperCase() + t.slice(1),
						})),
					},
				]}
			/>

			<DataTable
				columns={columns}
				data={filtered}
				emptyIcon={MessageSquare}
				emptyMessage="No community posts found"
			/>

			<ConfirmDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
				title="Delete Post?"
				description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone and will remove all engagement data.`}
				onConfirm={() => deletePost(deleteTarget._id)}
				destructive
			/>

			<PostDetailModal
				post={selectedPost}
				onClose={() => setSelectedPost(null)}
			/>
		</div>
	);
}
