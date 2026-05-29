// import { useEffect, useState } from "react";
// import { MessageSquare, Plus, X, Pin, Tag } from "lucide-react";
// import { db } from "../lib/firebase.config";
// import {
// 	collection,
// 	query,
// 	where,
// 	getDocs,
// 	addDoc,
// 	deleteDoc,
// 	doc,
// 	orderBy,
// 	getDoc,
// } from "firebase/firestore";
// import { useAuth } from "../lib/context/AuthContext";
// import LoadingSpinner from "../components/common/LoadingSpinner";

// const TYPE_OPTIONS = ["general", "deal", "announcement", "news", "wanted"];
// const TYPE_COLORS = {
// 	deal: "bg-green-100 text-green-700",
// 	announcement: "bg-blue-100 text-blue-700",
// 	news: "bg-orange-100 text-orange-700",
// 	wanted: "bg-red-100 text-red-700",
// 	general: "bg-gray-100 text-gray-600",
// };

// export default function Community() {
// 	const [posts, setPosts] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [showForm, setShowForm] = useState(false);
// 	const [selectedType, setSelectedType] = useState(null);
// 	const [form, setForm] = useState({
// 		title: "",
// 		content: "",
// 		type: "general",
// 	});
// 	const [submitting, setSubmitting] = useState(false);
// 	const { user, profile } = useAuth();

// 	const fetchPosts = async () => {
// 		setLoading(true);
// 		try {
// 			// Build query based on selected type
// 			let postsQuery;
// 			if (selectedType) {
// 				postsQuery = query(
// 					collection(db, "community_posts"),
// 					where("type", "==", selectedType),
// 					orderBy("pinned", "desc"),
// 					orderBy("created_at", "desc"),
// 				);
// 			} else {
// 				postsQuery = query(
// 					collection(db, "community_posts"),
// 					orderBy("pinned", "desc"),
// 					orderBy("created_at", "desc"),
// 				);
// 			}

// 			const postsSnapshot = await getDocs(postsQuery);
// 			const postsData = [];

// 			for (const postDoc of postsSnapshot.docs) {
// 				const postData = { id: postDoc.id, ...postDoc.data() };

// 				// Fetch author profile if author_id exists
// 				if (postData.author_id) {
// 					const authorDoc = await getDoc(
// 						doc(db, "profiles", postData.author_id),
// 					);
// 					if (authorDoc.exists()) {
// 						postData.profiles = authorDoc.data();
// 					}
// 				}

// 				postsData.push(postData);
// 			}

// 			setPosts(postsData);
// 		} catch (error) {
// 			console.error("Error fetching posts:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchPosts();
// 	}, [selectedType]);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (!user || !form.title.trim() || !form.content.trim()) return;

// 		setSubmitting(true);
// 		try {
// 			const newPost = {
// 				author_id: user.uid,
// 				title: form.title.trim(),
// 				content: form.content.trim(),
// 				type: form.type,
// 				pinned: false,
// 				created_at: new Date().toISOString(),
// 				updated_at: new Date().toISOString(),
// 			};

// 			const docRef = await addDoc(
// 				collection(db, "community_posts"),
// 				newPost,
// 			);

// 			// Fetch the user profile for the new post
// 			const authorDoc = await getDoc(doc(db, "profiles", user.uid));
// 			const postWithProfile = {
// 				id: docRef.id,
// 				...newPost,
// 				profiles: authorDoc.exists() ? authorDoc.data() : null,
// 			};

// 			setPosts((prev) => [postWithProfile, ...prev]);
// 			setForm({ title: "", content: "", type: "general" });
// 			setShowForm(false);
// 		} catch (error) {
// 			console.error("Error creating post:", error);
// 		} finally {
// 			setSubmitting(false);
// 		}
// 	};

// 	const handleDelete = async (postId) => {
// 		if (!user) return;
// 		if (!window.confirm("Delete this post?")) return;

// 		try {
// 			// Verify the user owns the post before deleting
// 			const postRef = doc(db, "community_posts", postId);
// 			await deleteDoc(postRef);
// 			setPosts((prev) => prev.filter((p) => p.id !== postId));
// 		} catch (error) {
// 			console.error("Error deleting post:", error);
// 		}
// 	};

// 	return (
// 		<div className="max-w-xl mx-auto px-4 py-4 space-y-4">
// 			<div className="flex items-center justify-between">
// 				<h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
// 					<MessageSquare size={22} className="text-orange-500" />{" "}
// 					Community Board
// 				</h1>
// 				{user && (
// 					<button
// 						onClick={() => setShowForm(!showForm)}
// 						className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
// 					>
// 						<Plus size={16} /> Post
// 					</button>
// 				)}
// 			</div>

// 			{showForm && user && (
// 				<div className="bg-white rounded-2xl border border-gray-100 p-4">
// 					<div className="flex items-center justify-between mb-3">
// 						<h2 className="font-bold text-gray-900">New Post</h2>
// 						<button
// 							onClick={() => setShowForm(false)}
// 							aria-label="Close form"
// 						>
// 							<X size={18} className="text-gray-400" />
// 						</button>
// 					</div>
// 					<form onSubmit={handleSubmit} className="space-y-3">
// 						<div className="flex gap-1.5 flex-wrap">
// 							{TYPE_OPTIONS.map((type) => (
// 								<button
// 									key={type}
// 									type="button"
// 									onClick={() =>
// 										setForm((prev) => ({ ...prev, type }))
// 									}
// 									className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
// 										form.type === type
// 											? TYPE_COLORS[type] +
// 												" ring-1 ring-offset-1 ring-current"
// 											: "bg-gray-100 text-gray-500"
// 									}`}
// 								>
// 									{type}
// 								</button>
// 							))}
// 						</div>
// 						<input
// 							type="text"
// 							placeholder="Post title..."
// 							value={form.title}
// 							onChange={(e) =>
// 								setForm((prev) => ({
// 									...prev,
// 									title: e.target.value,
// 								}))
// 							}
// 							required
// 							maxLength={100}
// 							className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
// 						/>
// 						<textarea
// 							placeholder="Share with the community..."
// 							value={form.content}
// 							onChange={(e) =>
// 								setForm((prev) => ({
// 									...prev,
// 									content: e.target.value,
// 								}))
// 							}
// 							required
// 							rows={4}
// 							className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
// 						/>
// 						<button
// 							type="submit"
// 							disabled={submitting}
// 							className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
// 						>
// 							{submitting ? "Posting..." : "Share Post"}
// 						</button>
// 					</form>
// 				</div>
// 			)}

// 			<div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
// 				<button
// 					onClick={() => setSelectedType(null)}
// 					className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
// 						!selectedType
// 							? "bg-gray-900 text-white"
// 							: "bg-white border border-gray-200 text-gray-600"
// 					}`}
// 				>
// 					All Posts
// 				</button>
// 				{TYPE_OPTIONS.map((type) => (
// 					<button
// 						key={type}
// 						onClick={() =>
// 							setSelectedType(type === selectedType ? null : type)
// 						}
// 						className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
// 							selectedType === type
// 								? TYPE_COLORS[type]
// 								: "bg-white border border-gray-200 text-gray-600"
// 						}`}
// 					>
// 						{type}
// 					</button>
// 				))}
// 			</div>

// 			{loading ? (
// 				<div className="flex justify-center py-16">
// 					<LoadingSpinner size="lg" />
// 				</div>
// 			) : posts.length === 0 ? (
// 				<div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
// 					<MessageSquare
// 						size={48}
// 						className="text-gray-300 mx-auto mb-3"
// 					/>
// 					<p className="font-semibold text-gray-700">No posts yet</p>
// 					<p className="text-gray-400 text-sm mt-1">
// 						Be the first to share with the community
// 					</p>
// 				</div>
// 			) : (
// 				<div className="space-y-3">
// 					{posts.map((post) => (
// 						<div
// 							key={post.id}
// 							className={`bg-white rounded-2xl border p-4 ${
// 								post.pinned
// 									? "border-orange-200 bg-orange-50/30"
// 									: "border-gray-100"
// 							}`}
// 						>
// 							<div className="flex items-start gap-3">
// 								<div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
// 									<span className="text-orange-600 font-bold text-sm">
// 										{post.profiles?.full_name?.[0]?.toUpperCase() ||
// 											"C"}
// 									</span>
// 								</div>
// 								<div className="flex-1 min-w-0">
// 									<div className="flex items-center gap-2 flex-wrap">
// 										<span
// 											className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex items-center gap-0.5 ${
// 												TYPE_COLORS[post.type] ||
// 												TYPE_COLORS.general
// 											}`}
// 										>
// 											<Tag size={10} />{" "}
// 											{post.type || "general"}
// 										</span>
// 										{post.pinned && (
// 											<span className="text-xs text-orange-500 font-medium flex items-center gap-0.5">
// 												<Pin size={10} /> Pinned
// 											</span>
// 										)}
// 									</div>
// 									<h3 className="font-bold text-gray-900 mt-1 text-sm">
// 										{post.title}
// 									</h3>
// 									<p className="text-gray-600 text-sm mt-1 leading-relaxed">
// 										{post.content}
// 									</p>
// 									<div className="flex items-center justify-between mt-2">
// 										<p className="text-xs text-gray-400">
// 											{post.profiles?.full_name ||
// 												"Community Member"}{" "}
// 											·{" "}
// 											{post.created_at
// 												? new Date(
// 														post.created_at,
// 													).toLocaleDateString(
// 														"en-KE",
// 														{
// 															day: "numeric",
// 															month: "short",
// 														},
// 													)
// 												: "Recently"}
// 										</p>
// 										{user?.uid === post.author_id && (
// 											<button
// 												onClick={() =>
// 													handleDelete(post.id)
// 												}
// 												className="text-xs text-red-400 hover:text-red-600 transition-colors"
// 											>
// 												Delete
// 											</button>
// 										)}
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					))}
// 				</div>
// 			)}
// 		</div>
// 	);
// }

import { useEffect, useState } from "react";
import { MessageSquare, Plus, X, Pin, Tag, AlertCircle } from "lucide-react";
import { communityAPI } from "../lib/api";
import { useAuth } from "../lib/context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TYPE_OPTIONS = ["general", "deal", "announcement", "news", "wanted"];
const TYPE_COLORS = {
	deal: "bg-green-100 text-green-700",
	announcement: "bg-blue-100 text-blue-700",
	news: "bg-orange-100 text-orange-700",
	wanted: "bg-red-100 text-red-700",
	general: "bg-gray-100 text-gray-600",
};

export default function Community() {
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

			// Transform posts to match frontend expectations
			const transformedPosts = response.data.map((post) => ({
				_id: post._id,
				id: post._id,
				title: post.title,
				content: post.content,
				type: post.type,
				pinned: post.pinned,
				createdAt: post.createdAt,
				authorId: post.authorId?._id || post.authorId,
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

	useEffect(() => {
		fetchPosts();
	}, [selectedType]);

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
			const newPost = {
				_id: response.data._id,
				id: response.data._id,
				title: response.data.title,
				content: response.data.content,
				type: response.data.type,
				pinned: false,
				createdAt: response.data.createdAt,
				authorId: user._id,
				author: {
					fullName: user.fullName,
					email: user.email,
				},
				authorName: user.fullName,
			};

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
			// Refresh posts to ensure consistency
			fetchPosts();
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
		<div className="max-w-xl mx-auto px-4 py-4 space-y-4">
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
					<AlertCircle size={16} className="text-red-500 mt-0.5" />
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
						<h2 className="font-bold text-gray-900">New Post</h2>
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
							{TYPE_OPTIONS.map((type) => (
								<button
									key={type}
									type="button"
									onClick={() =>
										setForm((prev) => ({ ...prev, type }))
									}
									className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
										form.type === type
											? TYPE_COLORS[type] +
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
				{TYPE_OPTIONS.map((type) => (
					<button
						key={type}
						onClick={() =>
							setSelectedType(type === selectedType ? null : type)
						}
						className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
							selectedType === type
								? TYPE_COLORS[type]
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
					<p className="font-semibold text-gray-700">No posts yet</p>
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
						<div
							key={post._id}
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
												TYPE_COLORS[post.type] ||
												TYPE_COLORS.general
											}`}
										>
											<Tag size={10} />{" "}
											{post.type || "general"}
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
												onClick={() =>
													handleDelete(post._id)
												}
												className="text-xs text-red-400 hover:text-red-600 transition-colors"
											>
												Delete
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
