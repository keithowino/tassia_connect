import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import api from "../../lib/api";

export default function ReactionBar({
	targetId,
	targetType, // 'post' or 'review'
	likes: initialLikes,
	dislikes: initialDislikes,
	commentsCount: initialCommentsCount,
	userReaction: initialUserReaction,
	onReact,
	onCommentToggle,
	commentsOpen,
	size = "sm",
}) {
	const [likes, setLikes] = useState(initialLikes || 0);
	const [dislikes, setDislikes] = useState(initialDislikes || 0);
	const [userReaction, setUserReaction] = useState(
		initialUserReaction || null,
	);
	const [loading, setLoading] = useState(false);

	// Update when props change
	useEffect(() => {
		setLikes(initialLikes || 0);
		setDislikes(initialDislikes || 0);
		setUserReaction(initialUserReaction || null);
	}, [initialLikes, initialDislikes, initialUserReaction]);

	const sizeClasses = {
		sm: { button: "px-2 py-1 text-xs", icon: 12, gap: "gap-1" },
		md: { button: "px-2.5 py-1.5 text-xs", icon: 14, gap: "gap-1.5" },
		lg: { button: "px-3 py-2 text-sm", icon: 16, gap: "gap-2" },
	};

	const s = sizeClasses[size] || sizeClasses.sm;

	const handleReaction = async (reaction) => {
		if (loading) return;

		if (!onReact) {
			console.error("onReact callback is required");
			return;
		}

		setLoading(true);

		try {
			// Determine if this is a toggle (remove) or add
			const isRemoving = userReaction === reaction;
			const action = isRemoving ? "remove" : "add";

			// Call the parent handler
			const result = await onReact(
				targetId,
				targetType,
				reaction,
				action,
				userReaction,
			);

			// Update local state based on result
			if (result) {
				if (reaction === "like") {
					setLikes(
						result.likesCount ??
							(isRemoving ? Math.max(0, likes - 1) : likes + 1),
					);
					setDislikes(result.dislikesCount ?? dislikes);
					setUserReaction(isRemoving ? null : reaction);
				} else {
					setDislikes(
						result.dislikesCount ??
							(isRemoving
								? Math.max(0, dislikes - 1)
								: dislikes + 1),
					);
					setLikes(result.likesCount ?? likes);
					setUserReaction(isRemoving ? null : reaction);
				}
			} else {
				// Fallback to optimistic update
				if (reaction === "like") {
					if (isRemoving) {
						setLikes((prev) => Math.max(0, prev - 1));
						setUserReaction(null);
					} else {
						setLikes((prev) => prev + 1);
						setUserReaction("like");
						// Remove dislike if present
						if (userReaction === "dislike") {
							setDislikes((prev) => Math.max(0, prev - 1));
						}
					}
				} else {
					if (isRemoving) {
						setDislikes((prev) => Math.max(0, prev - 1));
						setUserReaction(null);
					} else {
						setDislikes((prev) => prev + 1);
						setUserReaction("dislike");
						// Remove like if present
						if (userReaction === "like") {
							setLikes((prev) => Math.max(0, prev - 1));
						}
					}
				}
			}
		} catch (err) {
			console.error("Reaction error:", err);
			// Revert optimistic update on error
			setLikes(initialLikes || 0);
			setDislikes(initialDislikes || 0);
			setUserReaction(initialUserReaction || null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className={`flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 ${s.gap}`}
		>
			{/* Like Button */}
			<button
				onClick={() => handleReaction("like")}
				disabled={loading}
				className={`flex items-center rounded-full transition-all ${s.button} ${
					userReaction === "like"
						? "bg-orange-100 text-orange-600"
						: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
				}`}
			>
				<ThumbsUp
					size={s.icon}
					className={userReaction === "like" ? "fill-orange-500" : ""}
				/>
				<span>{likes}</span>
			</button>

			{/* Dislike Button */}
			<button
				onClick={() => handleReaction("dislike")}
				disabled={loading}
				className={`flex items-center rounded-full transition-all ${s.button} ${
					userReaction === "dislike"
						? "bg-gray-200 text-gray-700"
						: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
				}`}
			>
				<ThumbsDown
					size={s.icon}
					className={
						userReaction === "dislike" ? "fill-gray-600" : ""
					}
				/>
				<span>{dislikes}</span>
			</button>

			{/* Comments Button */}
			<button
				onClick={onCommentToggle}
				className={`flex items-center rounded-full transition-all ml-auto ${s.button} ${
					commentsOpen
						? "bg-orange-100 text-orange-600"
						: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
				}`}
			>
				<MessageCircle size={s.icon} />
				<span>{initialCommentsCount || 0} Comments</span>
			</button>
		</div>
	);
}
