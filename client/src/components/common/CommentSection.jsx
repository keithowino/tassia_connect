import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";

export default function CommentSection({
	targetId,
	targetType, // 'post' or 'review'
	comments: initialComments,
	onAddComment,
	onDeleteComment,
	currentUser,
}) {
	const [comments, setComments] = useState(initialComments || []);
	const [text, setText] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const formatRelativeTime = (dateString) => {
		if (!dateString) return "Just now";
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours}h ago`;
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString("en-KE", {
			day: "numeric",
			month: "short",
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!currentUser) {
			alert("Please login to comment");
			return;
		}
		if (!text.trim()) return;

		setSubmitting(true);
		try {
			const newComment = await onAddComment(
				targetId,
				targetType,
				text.trim(),
			);
			setComments((prev) => [newComment, ...prev]);
			setText("");
		} catch (err) {
			console.error("Comment error:", err);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (commentId) => {
		if (!window.confirm("Delete this comment?")) return;
		try {
			await onDeleteComment(targetId, targetType, commentId);
			setComments((prev) => prev.filter((c) => c._id !== commentId));
		} catch (err) {
			console.error("Delete error:", err);
		}
	};

	return (
		<div className="mt-3 space-y-3">
			{/* Comment Input */}
			{currentUser ? (
				<form
					onSubmit={handleSubmit}
					className="flex items-start gap-2"
				>
					<div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
						<span className="text-white font-bold text-xs">
							{currentUser.fullName?.[0]?.toUpperCase() || "U"}
						</span>
					</div>
					<div className="flex-1 flex gap-2">
						<input
							type="text"
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Write a comment..."
							maxLength={500}
							className="flex-1 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
						/>
						<button
							type="submit"
							disabled={submitting || !text.trim()}
							className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
						>
							<Send size={14} />
						</button>
					</div>
				</form>
			) : (
				<p className="text-xs text-gray-400 italic text-center py-2">
					Login to leave a comment.
				</p>
			)}

			{/* Comments List */}
			{comments.length === 0 ? (
				<p className="text-xs text-gray-400 text-center py-2">
					No comments yet. Be the first!
				</p>
			) : (
				<div className="space-y-2.5">
					{comments.map((comment) => (
						<div
							key={comment._id}
							className="flex items-start gap-2"
						>
							<div className="w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
								<span className="text-white font-bold text-xs">
									{comment.userId?.fullName?.[0]?.toUpperCase() ||
										"C"}
								</span>
							</div>
							<div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
								<div className="flex items-center justify-between gap-2">
									<span className="text-xs font-semibold text-gray-800">
										{comment.userId?.fullName ||
											"Community Member"}
									</span>
									<div className="flex items-center gap-1.5">
										<span className="text-xs text-gray-400">
											{formatRelativeTime(
												comment.createdAt,
											)}
										</span>
										{currentUser?._id ===
											comment.userId?._id && (
											<button
												onClick={() =>
													handleDelete(comment._id)
												}
												className="text-gray-300 hover:text-red-400 transition-colors"
											>
												<X size={12} />
											</button>
										)}
									</div>
								</div>
								<p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
									{comment.content}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
