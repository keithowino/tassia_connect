import { useEffect, useState } from "react";
import { MessageSquare, Plus, X, Pin, Tag, AlertCircle } from "lucide-react";
import { communityAPI } from "../lib/api";
import { useAuth } from "../lib/context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MetaDataInsert from "../lib/MetaDataInsert";
import { useCommon } from "../lib/context/CommonContext";
import ReactionBar from "../components/common/ReactionBar";
import CommentSection from "../components/common/CommentSection";

function PostCard({
	post,
	user,
	onDelete,
	onReact,
	onAddComment,
	onDeleteComment,
	formatDate,
	typeColors,
}) {
	const [showComments, setShowComments] = useState(false);

	return (
		<div
			className={`bg-white rounded-2xl border p-4 transition-all hover:shadow-sm ${
				post.pinned
					? "border-orange-200 bg-orange-50/30"
					: "border-gray-100"
			}`}
		>
			<div className="flex items-start gap-3">
				{/* Avatar */}
				<div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
					<span className="text-white font-bold text-sm">
						{post.author?.fullName?.[0]?.toUpperCase() ||
							post.authorName?.[0]?.toUpperCase() ||
							"C"}
					</span>
				</div>

				{/* Post Content */}
				<div className="flex-1 min-w-0">
					{/* Post Tags */}
					<div className="flex items-center gap-2 flex-wrap">
						<span
							className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex items-center gap-0.5 ${
								typeColors[post.type] || typeColors.general
							}`}
						>
							<Tag size={10} /> {post.type || "general"}
						</span>
						{post.pinned && (
							<span className="text-xs text-orange-500 font-medium flex items-center gap-0.5">
								<Pin size={10} /> Pinned
							</span>
						)}
					</div>

					{/* Title */}
					<h3 className="font-bold text-gray-900 mt-1 text-sm">
						{post.title}
					</h3>

					{/* Content */}
					<p className="text-gray-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
						{post.content}
					</p>

					{/* Footer */}
					<div className="flex items-center justify-between mt-2">
						<p className="text-xs text-gray-400">
							{post.author?.fullName ||
								post.authorName ||
								"Community Member"}{" "}
							· {formatDate(post.createdAt)}
						</p>
						{user && user._id === post.authorId && (
							<button
								onClick={() => onDelete(post._id)}
								className="text-xs text-red-400 hover:text-red-600 transition-colors"
							>
								Delete
							</button>
						)}
					</div>

					{/* Reaction Bar - Now using likesCount, dislikesCount */}
					<ReactionBar
						targetId={post._id}
						targetType="post"
						likes={post.likesCount || 0}
						dislikes={post.dislikesCount || 0}
						commentsCount={post.commentsCount || 0}
						userReaction={null} // We need to track this separately
						onReact={onReact}
						onCommentToggle={() => setShowComments(!showComments)}
						commentsOpen={showComments}
						size="sm"
					/>

					{/* Comment Section */}
					{showComments && (
						<CommentSection
							targetId={post._id}
							targetType="post"
							comments={post.comments || []}
							onAddComment={onAddComment}
							onDeleteComment={onDeleteComment}
							currentUser={user}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default function Community() {
	const { typeOptions, typeColors } = useCommon();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [selectedType, setSelectedType] = useState(null);
	const [form, setForm] = useState({
		title: "",
		content: "",
		type: "general",
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	// Fetch posts from API
	const fetchPosts = async () => {
		setLoading(true);
		setError(null);
		try {
			let response;
			if (selectedType) {
				response = await communityAPI.getByType(selectedType);
			} else {
				response = await communityAPI.getAll();
			}

			// Response data is already the posts array (from our API wrapper)
			const postsData = response.data || [];

			// Transform posts to ensure consistent data structure
			const transformedPosts = postsData.map((post) => ({
				_id: post._id,
				title: post.title,
				content: post.content,
				type: post.type,
				pinned: post.pinned,
				createdAt: post.createdAt,
				authorId: post.authorId?._id || post.authorId,
				likesCount: post.likesCount || post.likes?.length || 0,
				dislikesCount: post.dislikesCount || post.dislikes?.length || 0,
				commentsCount: post.commentsCount || post.comments?.length || 0,
				comments: post.comments || [],
				author: post.authorId
					? {
							fullName: post.authorId.fullName,
							email: post.authorId.email,
							profileImage: post.authorId.profileImage,
						}
					: null,
				authorName:
					post.authorId?.fullName ||
					post.authorName ||
					"Community Member",
			}));

			setPosts(transformedPosts);
		} catch (error) {
			console.error("Error fetching posts:", error);
			setError("Failed to load community posts. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Refetch when selectedType changes
	useEffect(() => {
		fetchPosts();
	}, [selectedType]);

	// Create new post
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!user) {
			setError("Please login to create a post");
			return;
		}

		if (!form.title.trim() || !form.content.trim()) {
			setError("Please fill in both title and content");
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const response = await communityAPI.create({
				title: form.title.trim(),
				content: form.content.trim(),
				type: form.type,
			});

			// Add the new post to the list
			const newPost = response.data;
			setPosts((prev) => [newPost, ...prev]);
			setForm({ title: "", content: "", type: "general" });
			setShowForm(false);
		} catch (error) {
			console.error("Error creating post:", error);
			setError(
				error.response?.data?.message ||
					"Failed to create post. Please try again.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	// Delete post
	const handleDelete = async (postId) => {
		if (!user) return;
		if (!window.confirm("Are you sure you want to delete this post?"))
			return;

		try {
			await communityAPI.delete(postId);
			setPosts((prev) => prev.filter((post) => post._id !== postId));
		} catch (error) {
			console.error("Error deleting post:", error);
			setError(error.response?.data?.message || "Failed to delete post");
			fetchPosts(); // Refresh to ensure consistency
		}
	};

	// Handle like/dislike reaction
	const handleReaction = async (
		targetId,
		targetType,
		reaction,
		action,
		currentReaction,
	) => {
		if (!user) {
			alert("Please login to react to posts");
			throw new Error("Not authenticated");
		}

		try {
			// Find the post to update
			const post = posts.find((p) => p._id === targetId);
			if (!post) throw new Error("Post not found");

			// Calculate optimistic values
			let newLikes = post.likesCount || post.likes?.length || 0;
			let newDislikes = post.dislikesCount || post.dislikes?.length || 0;

			if (reaction === "like") {
				if (action === "remove") {
					newLikes = Math.max(0, newLikes - 1);
				} else {
					newLikes = newLikes + 1;
					// Remove dislike if switching
					if (currentReaction === "dislike") {
						newDislikes = Math.max(0, newDislikes - 1);
					}
				}
			} else {
				if (action === "remove") {
					newDislikes = Math.max(0, newDislikes - 1);
				} else {
					newDislikes = newDislikes + 1;
					// Remove like if switching
					if (currentReaction === "like") {
						newLikes = Math.max(0, newLikes - 1);
					}
				}
			}

			// Update UI optimistically
			setPosts((prev) =>
				prev.map((p) =>
					p._id === targetId
						? {
								...p,
								likesCount: newLikes,
								dislikesCount: newDislikes,
							}
						: p,
				),
			);

			// Make the API call using communityAPI methods
			if (action === "remove") {
				// Remove reaction
				await communityAPI.removeReaction(targetId, reaction);
			} else {
				// Add reaction
				const response = await communityAPI.addReaction(
					targetId,
					reaction,
				);
				return response.data;
			}

			return { likesCount: newLikes, dislikesCount: newDislikes };
		} catch (error) {
			console.error("Reaction error:", error);
			// Revert optimistic update on error
			fetchPosts();
			alert("Failed to update reaction. Please try again.");
			throw error;
		}
	};

	// Add comment to post
	const handleAddComment = async (targetId, targetType, content) => {
		if (!user) {
			alert("Please login to comment");
			throw new Error("Not authenticated");
		}

		try {
			// Find the post
			const post = posts.find((p) => p._id === targetId);
			if (!post) throw new Error("Post not found");

			// Create temp comment for optimistic update
			const tempComment = {
				_id: `temp-${Date.now()}`,
				userId: { _id: user._id, fullName: user.fullName },
				content: content,
				createdAt: new Date().toISOString(),
			};

			// Update UI optimistically
			setPosts((prev) =>
				prev.map((p) =>
					p._id === targetId
						? {
								...p,
								comments: [...(p.comments || []), tempComment],
								commentsCount: (p.commentsCount || 0) + 1,
							}
						: p,
				),
			);

			// Make API call using communityAPI
			const response = await communityAPI.addComment(targetId, content);

			// Replace temp comment with real comment
			setPosts((prev) =>
				prev.map((p) =>
					p._id === targetId
						? {
								...p,
								comments: (p.comments || []).map((c) =>
									c._id === tempComment._id
										? response.data
										: c,
								),
							}
						: p,
				),
			);

			return response.data;
		} catch (error) {
			console.error("Add comment error:", error);
			// Revert optimistic update
			fetchPosts();
			alert("Failed to add comment. Please try again.");
			throw error;
		}
	};

	// Delete comment from post using communityAPI
	const handleDeleteComment = async (targetId, targetType, commentId) => {
		try {
			// Update UI optimistically (remove comment)
			setPosts((prev) =>
				prev.map((p) =>
					p._id === targetId
						? {
								...p,
								comments: (p.comments || []).filter(
									(c) => c._id !== commentId,
								),
								commentsCount: Math.max(
									0,
									(p.commentsCount || 1) - 1,
								),
							}
						: p,
				),
			);

			// Make API call using communityAPI
			await communityAPI.deleteComment(targetId, commentId);
		} catch (error) {
			console.error("Delete comment error:", error);
			// Revert optimistic update
			fetchPosts();
			alert("Failed to delete comment. Please try again.");
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "Recently";
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		return date.toLocaleDateString("en-KE", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<>
			<MetaDataInsert
				title="Community Board"
				description="Join the Tassia community conversation. Share announcements, deals, news, and connect with neighbors in your area."
				keywords="community board, local news, tassia community, neighborhood forum"
			/>

			<section className="max-w-xl mx-auto px-4 py-4 space-y-4">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						<MessageSquare size={22} className="text-orange-500" />
						Community Board
					</h1>
					{user && (
						<button
							onClick={() => {
								setShowForm(!showForm);
								setError(null);
							}}
							className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
						>
							<Plus size={16} /> Post
						</button>
					)}
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
						<AlertCircle
							size={16}
							className="text-red-500 mt-0.5"
						/>
						<p className="text-sm text-red-600 flex-1">{error}</p>
						<button
							onClick={() => setError(null)}
							className="text-red-400 hover:text-red-600"
						>
							<X size={14} />
						</button>
					</div>
				)}

				{/* Create Post Form */}
				{showForm && user && (
					<div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<h2 className="font-bold text-gray-900">
								New Post
							</h2>
							<button
								onClick={() => {
									setShowForm(false);
									setError(null);
								}}
								className="hover:bg-gray-100 p-1 rounded-full transition-colors"
								aria-label="Close form"
							>
								<X size={18} className="text-gray-400" />
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-3">
							{/* Post Type Selection */}
							<div className="flex gap-1.5 flex-wrap">
								{typeOptions.map((type) => (
									<button
										key={type}
										type="button"
										onClick={() =>
											setForm((prev) => ({
												...prev,
												type,
											}))
										}
										className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
											form.type === type
												? typeColors[type] +
													" ring-1 ring-offset-1 ring-current"
												: "bg-gray-100 text-gray-500 hover:bg-gray-200"
										}`}
									>
										{type}
									</button>
								))}
							</div>

							{/* Title Input */}
							<input
								type="text"
								placeholder="Post title..."
								value={form.title}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								required
								maxLength={100}
								className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
							/>

							{/* Content Textarea */}
							<textarea
								placeholder="Share with the community..."
								value={form.content}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										content: e.target.value,
									}))
								}
								required
								rows={4}
								maxLength={1000}
								className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
							/>

							{/* Character Counter */}
							<div className="text-right">
								<span className="text-xs text-gray-400">
									{form.content.length}/1000 characters
								</span>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={
									submitting ||
									!form.title.trim() ||
									!form.content.trim()
								}
								className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{submitting ? "Posting..." : "Share Post"}
							</button>
						</form>
					</div>
				)}

				{/* Type Filters */}
				<div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
					<button
						onClick={() => setSelectedType(null)}
						className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
							!selectedType
								? "bg-gray-900 text-white"
								: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
						}`}
					>
						All Posts
					</button>
					{typeOptions.map((type) => (
						<button
							key={type}
							onClick={() =>
								setSelectedType(
									type === selectedType ? null : type,
								)
							}
							className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
								selectedType === type
									? typeColors[type]
									: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
							}`}
						>
							{type}
						</button>
					))}
				</div>

				{/* Posts List */}
				{loading ? (
					<div className="flex justify-center py-16">
						<LoadingSpinner size="lg" />
					</div>
				) : posts.length === 0 ? (
					<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
						<MessageSquare
							size={48}
							className="text-gray-300 mx-auto mb-3"
						/>
						<p className="font-semibold text-gray-700">
							No posts yet
						</p>
						<p className="text-gray-400 text-sm mt-1">
							{selectedType
								? `No ${selectedType} posts available`
								: "Be the first to share with the community"}
						</p>
						{user && !showForm && (
							<button
								onClick={() => setShowForm(true)}
								className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
							>
								<Plus size={14} /> Create First Post
							</button>
						)}
					</div>
				) : (
					<div className="space-y-3">
						{posts.map((post) => (
							<PostCard
								key={post._id}
								post={post}
								user={user}
								onDelete={handleDelete}
								onReact={handleReaction}
								onAddComment={handleAddComment}
								onDeleteComment={handleDeleteComment}
								formatDate={formatDate}
								typeColors={typeColors}
							/>
						))}
					</div>
				)}
			</section>
		</>
	);
}
